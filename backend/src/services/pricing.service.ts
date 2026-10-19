import { Knex } from 'knex';
import { PricingChannelCell, PricingRow } from '../interfaces/report';
import { AppSettings, Channel } from '../interfaces/settings';
import recipeService, { CostContext } from './recipe.service';
import settingsService from './settings.service';
import pricingUtils from '../utils/pricing.utils';

/** Cuánto puede bajar el margen (0.5 pt) antes de que un margen aceptado vuelva a alertar */
const ACCEPT_TOLERANCE = 0.005;

export const targetFor = (channel: Channel, settings: AppSettings): number =>
	channel.target_margin_pct ?? settings.target_margin_pct;

export const buildCell = (
	cost: number,
	price: number | null,
	channel: Channel,
	settings: AppSettings,
	acceptedMargin: number | null = null
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
			status: 'sin_precio',
			accepted: false,
			accepted_margin: acceptedMargin
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
		status,
		// Sigue aceptado mientras el margen no caiga más de medio punto bajo el que se aceptó
		accepted: status !== 'ok' && acceptedMargin !== null && b.margin_pct + ACCEPT_TOLERANCE >= acceptedMargin,
		accepted_margin: acceptedMargin
	};
};

type CellRef = { recipe_id: number; channel_id: number };

/** Acepta (o deja de aceptar) el margen actual de productos/canales bajo la meta. */
export const setMarginAccepted = async (db: Knex, items: CellRef[], accepted: boolean): Promise<number> => {
	if (!accepted) {
		return db.transaction(async (trx) => {
			let n = 0;
			for (const i of items) n += await trx('margin_acceptances').where(i).delete();
			return n;
		});
	}
	const table = await pricingTable(db);
	return db.transaction(async (trx) => {
		let n = 0;
		for (const i of items) {
			const cell = table
				.find((r) => r.recipe_id === i.recipe_id)
				?.channels.find((c) => c.channel_id === i.channel_id);
			if (!cell || cell.margin_pct === null) continue;
			await trx('margin_acceptances')
				.insert({ ...i, accepted_margin: cell.margin_pct })
				.onConflict(['recipe_id', 'channel_id'])
				.merge({ accepted_margin: cell.margin_pct, accepted_at: trx.raw("datetime('now', 'localtime')") });
			n++;
		}
		return n;
	});
};

/** Tabla de productos vendibles con costo, precio y margen por canal (equivalente a la hoja "Venta"). */
export const pricingTable = async (db: Knex, ctx?: CostContext): Promise<PricingRow[]> => {
	const context = ctx || (await recipeService.loadCostContext(db));
	const [settings, channels, prices, acceptances] = await Promise.all([
		settingsService.getSettings(db),
		settingsService.listChannels(db, true),
		db('recipe_prices').select('recipe_id', 'channel_id', 'price') as Promise<
			{ recipe_id: number; channel_id: number; price: number }[]
		>,
		db('margin_acceptances').select('recipe_id', 'channel_id', 'accepted_margin') as Promise<
			{ recipe_id: number; channel_id: number; accepted_margin: number }[]
		>
	]);
	const priceMap = new Map(prices.map((p) => [`${p.recipe_id}:${p.channel_id}`, p.price]));
	const acceptMap = new Map(acceptances.map((a) => [`${a.recipe_id}:${a.channel_id}`, a.accepted_margin]));
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
					buildCell(
						cost.unit,
						priceMap.get(`${r.id}:${ch.id}`) ?? null,
						ch,
						settings,
						acceptMap.get(`${r.id}:${ch.id}`) ?? null
					)
				)
			};
		})
		.sort((a, b) => (a.category || '').localeCompare(b.category || '', 'es') || a.name.localeCompare(b.name, 'es'));
};

/** Guarda varios precios en una sola transacción (todo o nada). Precio null = quitar precio. */
export const savePrices = async (
	db: Knex,
	changes: { recipe_id: number; channel_id: number; price: number | null }[]
): Promise<number> =>
	db.transaction(async (trx) => {
		for (const c of changes) await recipeService.upsertPrice(trx, c.recipe_id, c.channel_id, c.price);
		return changes.length;
	});

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

/**
 * Copia los precios de un canal a todas las demás plataformas activas
 * (nunca a venta directa ni a canales que no son plataforma).
 * Los productos sin precio en el canal de origen no se tocan.
 */
export const syncFromChannel = async (
	db: Knex,
	sourceChannelId: number
): Promise<{ targets: string[]; changed: number }> =>
	db.transaction(async (trx) => {
		const targets: { id: number; name: string }[] = await trx('channels')
			.where({ active: 1, is_platform: 1 })
			.whereNot({ id: sourceChannelId })
			.orderBy('sort_order')
			.select('id', 'name');
		const source: { recipe_id: number; price: number }[] = await trx('recipe_prices')
			.where({ channel_id: sourceChannelId })
			.select('recipe_id', 'price');
		const current: { recipe_id: number; channel_id: number; price: number }[] = targets.length
			? await trx('recipe_prices')
					.whereIn(
						'channel_id',
						targets.map((t) => t.id)
					)
					.select('recipe_id', 'channel_id', 'price')
			: [];
		const currentMap = new Map(current.map((c) => [`${c.recipe_id}:${c.channel_id}`, c.price]));
		let changed = 0;
		for (const t of targets) {
			for (const s of source) {
				if (currentMap.get(`${s.recipe_id}:${t.id}`) === s.price) continue;
				await recipeService.upsertPrice(trx, s.recipe_id, t.id, s.price);
				changed++;
			}
		}
		return { targets: targets.map((t) => t.name), changed };
	});

export interface PriceCheckpoint {
	created_at: string;
	items: { recipe_id: number; channel_id: number; price: number | null }[];
}

/** Punto de control guardado (o null si nunca se ha guardado uno). */
export const getCheckpoint = async (db: Knex): Promise<PriceCheckpoint | null> => {
	const head = await db('price_checkpoint').where({ id: 1 }).first('created_at');
	if (!head) return null;
	const items = await db('price_checkpoint_items').select('recipe_id', 'channel_id', 'price');
	return { created_at: head.created_at, items };
};

/**
 * Reemplaza el punto de control con los precios guardados en este momento.
 * Incluye cada producto vendible × canal, con null donde no había precio,
 * para que al restaurar también se quiten precios agregados después.
 */
export const saveCheckpoint = async (db: Knex): Promise<PriceCheckpoint | null> => {
	await db.transaction(async (trx) => {
		await trx('price_checkpoint_items').delete();
		await trx.raw(
			`INSERT INTO price_checkpoint_items (recipe_id, channel_id, price)
			 SELECT r.id, c.id, p.price
			 FROM recipes r
			 CROSS JOIN channels c
			 LEFT JOIN recipe_prices p ON p.recipe_id = r.id AND p.channel_id = c.id
			 WHERE r.kind <> 'preparacion'`
		);
		await trx('price_checkpoint')
			.insert({ id: 1, created_at: trx.raw("datetime('now', 'localtime')") })
			.onConflict('id')
			.merge();
	});
	return getCheckpoint(db);
};

export const priceHistory = async (db: Knex, recipeId: number) =>
	db('recipe_price_history as h')
		.join('channels as c', 'c.id', 'h.channel_id')
		.where('h.recipe_id', recipeId)
		.select('h.*', 'c.name as channel_name')
		.orderBy('h.id', 'desc');

export default {
	targetFor,
	buildCell,
	setMarginAccepted,
	pricingTable,
	savePrices,
	applySuggested,
	syncFromChannel,
	getCheckpoint,
	saveCheckpoint,
	priceHistory
};
