import { Knex } from 'knex';
import { PricingChannelCell, PricingRow } from '../interfaces/report';
import { AppSettings, Channel } from '../interfaces/settings';
import recipeService, { CostContext } from './recipe.service';
import settingsService from './settings.service';
import pricingUtils from '../utils/pricing.utils';

export const targetFor = (channel: Channel, settings: AppSettings): number =>
	channel.target_margin_pct ?? settings.target_margin_pct;

export const buildCell = (
	cost: number,
	price: number | null,
	channel: Channel,
	settings: AppSettings
): PricingChannelCell => {
	const target = targetFor(channel, settings);
	const suggested = pricingUtils.suggestedPrice(cost, channel, settings.iva_rate, target, settings.price_rounding);
	if (price === null || price === undefined) {
		return {
			channel_id: channel.id,
			price: null,
			commission: 0,
			iva: 0,
			isr: 0,
			profit: null,
			margin_pct: null,
			food_cost_pct: null,
			suggested_price: suggested,
			target_margin_pct: target,
			status: 'sin_precio'
		};
	}
	const b = pricingUtils.breakdown(price, cost, channel, settings.iva_rate);
	const status = b.profit < 0 ? 'perdida' : b.margin_pct + 1e-9 < target ? 'bajo' : 'ok';
	return {
		channel_id: channel.id,
		price,
		commission: pricingUtils.round2(b.commission),
		iva: pricingUtils.round2(b.iva),
		isr: pricingUtils.round2(b.isr),
		profit: pricingUtils.round2(b.profit),
		margin_pct: b.margin_pct,
		food_cost_pct: price > 0 ? cost / price : null,
		suggested_price: suggested,
		target_margin_pct: target,
		status
	};
};

/** Tabla de productos vendibles con costo, precio y margen por canal (equivalente a la hoja "Venta"). */
export const pricingTable = async (db: Knex, ctx?: CostContext): Promise<PricingRow[]> => {
	const context = ctx || (await recipeService.loadCostContext(db));
	const [settings, channels, prices] = await Promise.all([
		settingsService.getSettings(db),
		settingsService.listChannels(db, true),
		db('recipe_prices').select('recipe_id', 'channel_id', 'price') as Promise<
			{ recipe_id: number; channel_id: number; price: number }[]
		>
	]);
	const priceMap = new Map(prices.map((p) => [`${p.recipe_id}:${p.channel_id}`, p.price]));
	return context.recipes
		.filter((r) => r.kind !== 'preparacion' && r.active)
		.map((r) => {
			const cost = recipeService.costOf(context, r.id);
			return {
				recipe_id: r.id,
				name: r.name,
				kind: r.kind,
				category: r.category,
				cost_unit: cost.unit,
				packaging_unit: cost.packaging_unit,
				channels: channels.map((ch) =>
					buildCell(cost.unit, priceMap.get(`${r.id}:${ch.id}`) ?? null, ch, settings)
				)
			};
		})
		.sort((a, b) => (a.category || '').localeCompare(b.category || '', 'es') || a.name.localeCompare(b.name, 'es'));
};

/** Aplica el precio sugerido a los productos/canales indicados. Devuelve cuántos cambió. */
export const applySuggested = async (
	db: Knex,
	targets: { recipe_id: number; channel_id: number }[]
): Promise<number> => {
	const table = await pricingTable(db);
	let changed = 0;
	await db.transaction(async (trx) => {
		for (const t of targets) {
			const cell = table
				.find((r) => r.recipe_id === t.recipe_id)
				?.channels.find((c) => c.channel_id === t.channel_id);
			if (!cell?.suggested_price) continue;
			await recipeService.upsertPrice(trx, t.recipe_id, t.channel_id, cell.suggested_price);
			changed++;
		}
	});
	return changed;
};

export const priceHistory = async (db: Knex, recipeId: number) =>
	db('recipe_price_history as h')
		.join('channels as c', 'c.id', 'h.channel_id')
		.where('h.recipe_id', recipeId)
		.select('h.*', 'c.name as channel_name')
		.orderBy('h.id', 'desc');

export default { targetFor, buildCell, pricingTable, applySuggested, priceHistory };
