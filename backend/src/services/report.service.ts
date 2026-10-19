import { Knex } from 'knex';
import {
	Alert,
	BreakEven,
	ChannelTotals,
	Dashboard,
	DailyPoint,
	DaySummary,
	HeatCell,
	MenuEngineering,
	ProductStat,
	TaxSummary,
	Totals
} from '../interfaces/report';
import { FixedExpense } from '../interfaces/settings';
import settingsService from './settings.service';
import orderService from './order.service';
import pricingService from './pricing.service';
import recipeService from './recipe.service';
import ingredientService from './ingredient.service';
import dateUtils from '../utils/date.utils';
import pricingUtils from '../utils/pricing.utils';

const r2 = pricingUtils.round2;

const SUM_FIELDS = [
	'gross_amount',
	'discount_store',
	'net_sale',
	'iva_amount',
	'commission_amount',
	'isr_ret_amount',
	'iva_ret_amount',
	'cost_amount',
	'profit_amount',
	'payout_amount'
] as const;

const range = (q: Knex.QueryBuilder, from: string, to: string, alias = 'o') =>
	q
		.where(`${alias}.status`, 'completado')
		.where(`${alias}.ordered_at`, '>=', `${from} 00:00`)
		.where(`${alias}.ordered_at`, '<=', `${to} 23:59`);

const sumSelect = (db: Knex, alias = 'o') => [
	db.raw(`COUNT(DISTINCT ${alias}.id) AS orders`),
	...SUM_FIELDS.map((f) => db.raw(`COALESCE(SUM(${alias}.${f}), 0) AS ${f}`))
];

const finishTotals = (row: Record<string, number>, units: number): Totals => {
	const t = { orders: Number(row.orders || 0), units } as Totals;
	for (const f of SUM_FIELDS) t[f] = r2(Number(row[f] || 0));
	t.avg_ticket = t.orders ? r2(t.net_sale / t.orders) : 0;
	t.margin_pct = t.net_sale ? t.profit_amount / t.net_sale : 0;
	return t;
};

const unitsIn = async (db: Knex, from: string, to: string, channelId?: number): Promise<number> => {
	const q = range(db('order_items as i').join('orders as o', 'o.id', 'i.order_id'), from, to)
		.whereNull('i.parent_item_id')
		.sum({ units: 'i.quantity' });
	if (channelId) q.where('o.channel_id', channelId);
	const row = await q.first();
	return Number(row?.units || 0);
};

export const totals = async (db: Knex, from: string, to: string): Promise<Totals> => {
	const row = await range(db('orders as o'), from, to).first(sumSelect(db));
	return finishTotals(row, await unitsIn(db, from, to));
};

export const byChannel = async (db: Knex, from: string, to: string): Promise<ChannelTotals[]> => {
	const rows = await range(db('orders as o').join('channels as c', 'c.id', 'o.channel_id'), from, to)
		.groupBy('c.id')
		.select('c.id as channel_id', 'c.name as channel_name', 'c.color', ...sumSelect(db))
		.orderBy('net_sale', 'desc');
	const out: ChannelTotals[] = [];
	for (const r of rows) {
		out.push({
			...finishTotals(r, await unitsIn(db, from, to, r.channel_id)),
			channel_id: r.channel_id,
			channel_name: r.channel_name,
			color: r.color
		});
	}
	return out;
};

export const daily = async (db: Knex, from: string, to: string): Promise<DailyPoint[]> => {
	const rows = await range(db('orders as o'), from, to)
		.groupByRaw('substr(o.ordered_at, 1, 10)')
		.select(
			db.raw('substr(o.ordered_at, 1, 10) AS date'),
			db.raw('COUNT(*) AS orders'),
			db.raw('SUM(o.net_sale) AS net_sale'),
			db.raw('SUM(o.profit_amount) AS profit'),
			db.raw('SUM(o.cost_amount) AS cost'),
			db.raw('SUM(o.commission_amount) AS commission')
		);
	const byDate = new Map<string, DailyPoint>(rows.map((r: DailyPoint) => [r.date, r]));
	const out: DailyPoint[] = [];
	for (let d = from; d <= to; d = dateUtils.addDays(d, 1)) {
		const r = byDate.get(d);
		out.push({
			date: d,
			orders: Number(r?.orders || 0),
			net_sale: r2(Number(r?.net_sale || 0)),
			profit: r2(Number(r?.profit || 0)),
			cost: r2(Number(r?.cost || 0)),
			commission: r2(Number(r?.commission || 0))
		});
		if (out.length > 400) break;
	}
	return out;
};

/**
 * Venta, costo y utilidad por producto. La utilidad de cada línea se obtiene repartiendo
 * descuentos, IVA, comisión e ISR del pedido en proporción al importe de la línea.
 */
export const productStats = async (db: Knex, from: string, to: string, channelId?: number): Promise<ProductStat[]> => {
	const q = range(
		db('order_items as i')
			.join('orders as o', 'o.id', 'i.order_id')
			.leftJoin('recipes as r', 'r.id', 'i.recipe_id'),
		from,
		to
	)
		.whereNull('i.parent_item_id')
		.select(
			'i.recipe_id',
			'i.name',
			'r.name as recipe_name',
			'r.category',
			'i.quantity',
			'i.line_total',
			'i.line_cost',
			'o.gross_amount',
			'o.net_sale',
			'o.profit_amount',
			'o.cost_amount',
			db.raw(
				'(SELECT COALESCE(SUM(c.line_cost), 0) FROM order_items c WHERE c.parent_item_id = i.id) AS children_cost'
			)
		);
	if (channelId) q.where('o.channel_id', channelId);
	const rows = await q;
	const map = new Map<string, ProductStat>();
	for (const r of rows) {
		const key = r.recipe_id ? `r${r.recipe_id}` : `n${r.name}`;
		const share = r.gross_amount > 0 ? r.line_total / r.gross_amount : 0;
		const sales = r.net_sale * share;
		const cost = r.line_cost + Number(r.children_cost);
		const profit = (r.profit_amount + r.cost_amount) * share - cost;
		const stat = map.get(key) || {
			recipe_id: r.recipe_id,
			name: r.recipe_name || r.name,
			category: r.category || 'Sin categoría',
			units: 0,
			sales: 0,
			cost: 0,
			profit: 0,
			profit_per_unit: 0,
			margin_pct: 0
		};
		stat.units += r.quantity;
		stat.sales += sales;
		stat.cost += cost;
		stat.profit += profit;
		map.set(key, stat);
	}
	return [...map.values()].map((s) => ({
		...s,
		sales: r2(s.sales),
		cost: r2(s.cost),
		profit: r2(s.profit),
		profit_per_unit: s.units ? r2(s.profit / s.units) : 0,
		margin_pct: s.sales ? s.profit / s.sales : 0
	}));
};

/**
 * Ingeniería de menú (Kasavana & Smith):
 *  popularidad alta si participación >= 70% de la participación promedio (0.7 / n);
 *  margen alto si utilidad por unidad >= utilidad promedio ponderada.
 */
export const menuEngineering = (stats: ProductStat[]): MenuEngineering => {
	const totalUnits = stats.reduce((a, s) => a + s.units, 0);
	const totalProfit = stats.reduce((a, s) => a + s.profit, 0);
	const popularity = stats.length ? 0.7 / stats.length : 0;
	const marginThreshold = totalUnits ? totalProfit / totalUnits : 0;
	return {
		popularity_threshold: popularity,
		margin_threshold: r2(marginThreshold),
		rows: stats.map((s) => {
			const pop = totalUnits ? s.units / totalUnits : 0;
			const popular = pop >= popularity;
			const profitable = s.profit_per_unit > 0 && s.profit_per_unit >= marginThreshold;
			return {
				...s,
				popularity_pct: pop,
				classification:
					popular && profitable ? 'estrella' : popular ? 'caballo' : profitable ? 'enigma' : 'perro'
			};
		})
	};
};

export const heatmap = async (db: Knex, from: string, to: string): Promise<HeatCell[]> => {
	const rows = await range(db('orders as o'), from, to)
		.groupByRaw("strftime('%w', o.ordered_at), strftime('%H', o.ordered_at)")
		.select(
			db.raw("CAST(strftime('%w', o.ordered_at) AS INTEGER) AS weekday"),
			db.raw("CAST(strftime('%H', o.ordered_at) AS INTEGER) AS hour"),
			db.raw('COUNT(*) AS orders'),
			db.raw('SUM(o.net_sale) AS net_sale')
		);
	return rows.map((r: HeatCell) => ({ ...r, net_sale: r2(Number(r.net_sale)) }));
};

const MONTHLY_FACTOR: Record<FixedExpense['frequency'], number> = {
	diario: 30,
	semanal: 52 / 12,
	quincenal: 2,
	mensual: 1,
	anual: 1 / 12
};

export const breakEven = async (db: Knex, t: Totals, from: string, to: string): Promise<BreakEven> => {
	const expenses = (await settingsService.listExpenses(db)).filter((e) => e.active);
	const monthly = expenses.reduce((a, e) => a + e.amount * MONTHLY_FACTOR[e.frequency], 0);
	const days = dateUtils.daysBetween(from, to);
	const dailyFixed = monthly / 30;
	const avgProfit = t.orders ? t.profit_amount / t.orders : 0;
	const needed = avgProfit > 0 ? dailyFixed / avgProfit : null;
	return {
		monthly_fixed: r2(monthly),
		daily_fixed: r2(dailyFixed),
		avg_profit_per_order: r2(avgProfit),
		avg_ticket: t.avg_ticket,
		orders_per_day_needed: needed === null ? null : Math.ceil(needed * 10) / 10,
		sales_per_day_needed: needed === null ? null : r2(needed * t.avg_ticket),
		days_in_range: days,
		avg_orders_per_day: days ? Math.round((t.orders / days) * 10) / 10 : 0,
		net_after_fixed: r2(t.profit_amount - dailyFixed * days)
	};
};

export const taxes = (t: Totals): TaxSummary => ({
	iva_trasladado: t.iva_amount,
	iva_retenido: t.iva_ret_amount,
	iva_por_pagar: r2(t.iva_amount - t.iva_ret_amount),
	isr_retenido: t.isr_ret_amount,
	base_sin_iva: r2(t.net_sale - t.iva_amount)
});

export const byHour = async (db: Knex, from: string, to: string) =>
	(
		await range(db('orders as o'), from, to)
			.groupByRaw("strftime('%H', o.ordered_at)")
			.select(
				db.raw("CAST(strftime('%H', o.ordered_at) AS INTEGER) AS hour"),
				db.raw('COUNT(*) AS orders'),
				db.raw('SUM(o.net_sale) AS net_sale'),
				db.raw('SUM(o.profit_amount) AS profit')
			)
			.orderBy('hour')
	).map((r: { hour: number; orders: number; net_sale: number; profit: number }) => ({
		...r,
		net_sale: r2(r.net_sale),
		profit: r2(r.profit)
	}));

export const daySummary = async (db: Knex, date: string): Promise<DaySummary> => {
	const lastWeek = dateUtils.addDays(date, -7);
	const [t, channels, hours, products, settings, orders, prev] = await Promise.all([
		totals(db, date, date),
		byChannel(db, date, date),
		byHour(db, date, date),
		productStats(db, date, date),
		settingsService.getSettings(db),
		orderService.listOrders(db, { from: date, to: date }),
		totals(db, lastWeek, lastWeek)
	]);
	return {
		date,
		totals: t,
		by_channel: channels,
		by_hour: hours,
		top_products: products.sort((a, b) => b.units - a.units || b.profit - a.profit).slice(0, 8),
		goals: { sales: settings.daily_sales_goal, profit: settings.daily_profit_goal },
		orders,
		compare: { label: 'mismo día de la semana pasada', totals: prev }
	};
};

export const dashboard = async (db: Knex, from: string, to: string): Promise<Dashboard> => {
	const days = dateUtils.daysBetween(from, to);
	const prevTo = dateUtils.addDays(from, -1);
	const prevFrom = dateUtils.addDays(prevTo, -(days - 1));
	const [t, previous, channels, series, stats, heat, promos] = await Promise.all([
		totals(db, from, to),
		totals(db, prevFrom, prevTo),
		byChannel(db, from, to),
		daily(db, from, to),
		productStats(db, from, to),
		heatmap(db, from, to),
		range(db('order_promotions as p').join('orders as o', 'o.id', 'p.order_id'), from, to)
			.groupBy('p.description')
			.select(
				'p.description',
				db.raw('COUNT(*) AS times'),
				db.raw('SUM(p.store_amount) AS store_amount'),
				db.raw('SUM(p.platform_amount) AS platform_amount')
			)
			.orderBy('store_amount', 'desc')
	]);
	const categories = new Map<string, { category: string; units: number; sales: number; profit: number }>();
	for (const s of stats) {
		const c = categories.get(s.category || 'Sin categoría') || {
			category: s.category || 'Sin categoría',
			units: 0,
			sales: 0,
			profit: 0
		};
		c.units += s.units;
		c.sales = r2(c.sales + s.sales);
		c.profit = r2(c.profit + s.profit);
		categories.set(c.category, c);
	}
	return {
		from,
		to,
		totals: t,
		previous,
		by_channel: channels,
		daily: series,
		by_category: [...categories.values()].sort((a, b) => b.sales - a.sales),
		top_by_units: [...stats].sort((a, b) => b.units - a.units).slice(0, 10),
		top_by_profit: [...stats].sort((a, b) => b.profit - a.profit).slice(0, 10),
		worst_by_margin: [...stats]
			.filter((s) => s.units > 0)
			.sort((a, b) => a.margin_pct - b.margin_pct)
			.slice(0, 5),
		heatmap: heat,
		menu: menuEngineering(stats),
		break_even: await breakEven(db, t, from, to),
		taxes: taxes(t),
		promotions: promos.map((p: Dashboard['promotions'][number]) => ({
			...p,
			store_amount: r2(Number(p.store_amount)),
			platform_amount: r2(Number(p.platform_amount))
		}))
	};
};

/** Alertas accionables: productos con pérdida o bajo margen, alzas de costos, faltantes de precio. */
export const alerts = async (db: Knex): Promise<Alert[]> => {
	const ctx = await recipeService.loadCostContext(db);
	const [table, channels, changes] = await Promise.all([
		pricingService.pricingTable(db, ctx),
		settingsService.listChannels(db, true),
		ingredientService.recentCostChanges(db, 14)
	]);
	const chName = new Map(channels.map((c) => [c.id, c.name]));
	const out: Alert[] = [];

	for (const row of table) {
		const losses = row.channels.filter((c) => c.status === 'perdida');
		const low = row.channels.filter((c) => c.status === 'bajo');
		const missing = row.channels.filter((c) => c.status === 'sin_precio');
		if (losses.length) {
			out.push({
				level: 'danger',
				type: 'margen',
				title: `${row.name} pierde dinero`,
				detail: losses
					.map(
						(c) =>
							`${chName.get(c.channel_id)}: $${c.price} → utilidad $${c.profit} (sugerido $${c.suggested_price ?? '—'})`
					)
					.join(' · '),
				link: '/precios'
			});
		} else if (low.length) {
			out.push({
				level: 'warning',
				type: 'margen',
				title: `${row.name} está bajo el margen objetivo`,
				detail: low
					.map(
						(c) =>
							`${chName.get(c.channel_id)}: ${((c.margin_pct || 0) * 100).toFixed(0)}% (objetivo ${(c.target_margin_pct * 100).toFixed(0)}%, sugerido $${c.suggested_price ?? '—'})`
					)
					.join(' · '),
				link: '/precios'
			});
		}
		if (missing.length && missing.length < row.channels.length) {
			out.push({
				level: 'info',
				type: 'precio',
				title: `${row.name} no tiene precio en ${missing.map((c) => chName.get(c.channel_id)).join(', ')}`,
				detail: 'Sin precio no se puede calcular su margen en ese canal',
				link: '/precios'
			});
		}
	}

	const latest = new Map<number, (typeof changes)[number]>();
	for (const c of changes) if (!latest.has(c.ingredient_id)) latest.set(c.ingredient_id, c);
	for (const c of latest.values()) {
		if (!c.old_cost || c.new_cost <= c.old_cost) continue;
		const pct = (c.new_cost / c.old_cost - 1) * 100;
		if (pct < 5) continue;
		const used = ctx.items.filter((i) => i.ingredient_id === c.ingredient_id).length;
		out.push({
			level: pct >= 15 ? 'warning' : 'info',
			type: 'costo',
			title: `Subió ${c.name} ${pct.toFixed(0)}%`,
			detail: `De $${c.old_cost} a $${c.new_cost} el ${c.changed_at.slice(0, 10)}. Se usa en ${used} receta(s); revisa sus precios.`,
			link: '/ingredientes'
		});
	}

	for (const r of ctx.recipes) {
		const cost = ctx.costs.get(r.id);
		if (cost?.error)
			out.push({
				level: 'danger',
				type: 'receta',
				title: `Error en ${r.name}`,
				detail: cost.error,
				link: `/recetas/${r.id}`
			});
		else if (r.active && r.kind !== 'combo' && !ctx.items.some((i) => i.recipe_id === r.id)) {
			out.push({
				level: 'info',
				type: 'receta',
				title: `${r.name} no tiene componentes`,
				detail: 'Su costo es $0',
				link: `/recetas/${r.id}`
			});
		}
	}
	const order = { danger: 0, warning: 1, info: 2 };
	return out.sort((a, b) => order[a.level] - order[b.level]);
};

export default {
	totals,
	byChannel,
	daily,
	productStats,
	menuEngineering,
	heatmap,
	breakEven,
	taxes,
	byHour,
	daySummary,
	dashboard,
	alerts
};
