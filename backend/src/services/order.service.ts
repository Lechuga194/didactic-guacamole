import { Knex } from 'knex';
import {
	Order,
	OrderDetail,
	OrderFilters,
	OrderInput,
	OrderItemDetail,
	OrderItemInput,
	OrderItemRow,
	OrderListRow,
	OrderModifierRow,
	OrderPromotionRow,
	OrderTotals
} from '../interfaces/order';
import { ModifierOption } from '../interfaces/modifier';
import { AppSettings, Channel } from '../interfaces/settings';
import recipeService, { CostContext } from './recipe.service';
import modifierService from './modifier.service';
import pricingUtils from '../utils/pricing.utils';

interface ComputedModifier {
	modifier_option_id: number | null;
	group_name: string | null;
	name: string;
	quantity: number;
	price_delta: number;
	cost_delta: number;
}

interface ComputedItem {
	recipe_id: number | null;
	name: string;
	quantity: number;
	unit_price: number;
	modifiers_price: number;
	line_total: number;
	recipe_cost: number;
	unit_cost: number;
	line_cost: number;
	modifiers: ComputedModifier[];
	children: ComputedItem[];
}

export interface ComputedOrder {
	items: ComputedItem[];
	totals: OrderTotals;
}

const r2 = pricingUtils.round2;

/**
 * Calcula costos y totales de un pedido.
 * - Las líneas existentes (con id) que conservan su receta mantienen el costo histórico.
 * - En un combo con productos hijos, el costo lo cargan los hijos.
 */
export const computeOrder = (
	input: OrderInput,
	channel: Channel,
	settings: AppSettings,
	ctx: CostContext,
	options: ModifierOption[],
	previous: Map<number, OrderItemRow> = new Map()
): ComputedOrder => {
	const optById = new Map(options.map((o) => [o.id, o]));

	const computeItem = (it: OrderItemInput): ComputedItem => {
		const old = it.id ? previous.get(it.id) : undefined;
		const children = (it.children || []).map(computeItem);
		const modifiers: ComputedModifier[] = (it.modifiers || []).map((m) => {
			const opt = m.modifier_option_id ? optById.get(m.modifier_option_id) : undefined;
			const cost = m.cost_delta ?? (opt ? modifierService.optionCost(opt, ctx) : 0);
			return {
				modifier_option_id: opt ? opt.id : null,
				group_name: m.group_name ?? null,
				name: m.name,
				quantity: m.quantity ?? 1,
				price_delta: m.price_delta || 0,
				cost_delta: r2(cost)
			};
		});
		const modPrice = modifiers.reduce((a, m) => a + m.price_delta * m.quantity, 0);
		const modCost = modifiers.reduce((a, m) => a + m.cost_delta * m.quantity, 0);
		const recipeCost = children.length
			? 0
			: old && old.recipe_id === it.recipe_id
				? old.recipe_cost
				: recipeService.costOf(ctx, it.recipe_id).unit;
		const unitCost = recipeCost + modCost;
		return {
			recipe_id: it.recipe_id || null,
			name: it.name,
			quantity: it.quantity,
			unit_price: r2(it.unit_price || 0),
			modifiers_price: r2(modPrice),
			line_total: r2(it.quantity * ((it.unit_price || 0) + modPrice)),
			recipe_cost: r2(recipeCost),
			unit_cost: r2(unitCost),
			line_cost: r2(it.quantity * unitCost),
			modifiers,
			children
		};
	};

	const items = input.items.map(computeItem);
	const flat = items.flatMap((i) => [i, ...i.children]);
	const promos = input.promotions || [];
	const totals = pricingUtils.orderTotals(
		{
			gross_amount: flat.reduce((a, i) => a + i.line_total, 0),
			discount_store: promos.reduce((a, p) => a + (p.store_amount || 0), 0),
			discount_platform: promos.reduce((a, p) => a + (p.platform_amount || 0), 0),
			cost_amount: flat.reduce((a, i) => a + i.line_cost, 0)
		},
		channel,
		settings.iva_rate
	);
	return { items, totals };
};

const insertItems = async (
	trx: Knex,
	orderId: number,
	items: ComputedItem[],
	parentId: number | null
): Promise<number[]> => {
	const ids: number[] = [];
	for (const [idx, it] of items.entries()) {
		const [id] = await trx('order_items').insert({
			order_id: orderId,
			parent_item_id: parentId,
			recipe_id: it.recipe_id,
			name: it.name,
			quantity: it.quantity,
			unit_price: it.unit_price,
			modifiers_price: it.modifiers_price,
			line_total: it.line_total,
			recipe_cost: it.recipe_cost,
			unit_cost: it.unit_cost,
			line_cost: it.line_cost,
			sort_order: idx
		});
		ids.push(id);
		if (it.modifiers.length) {
			await trx('order_item_modifiers').insert(it.modifiers.map((m) => ({ ...m, order_item_id: id })));
		}
		if (it.children.length) await insertItems(trx, orderId, it.children, id);
	}
	return ids;
};

/** Inserta o reemplaza un pedido completo. */
export const saveOrder = async (db: Knex, input: OrderInput, computed: ComputedOrder, id?: number): Promise<number> =>
	db.transaction(async (trx) => {
		const row = {
			channel_id: input.channel_id,
			ordered_at: input.ordered_at,
			external_ref: input.external_ref || null,
			status: input.status || 'completado',
			source: input.source || 'manual',
			notes: input.notes || null,
			reported_payout: input.reported_payout ?? null,
			...computed.totals
		};
		let orderId = id;
		if (orderId) {
			await trx('orders')
				.where({ id: orderId })
				.update({ ...row, updated_at: trx.raw("datetime('now', 'localtime')") });
			await trx('order_promotions').where({ order_id: orderId }).delete();
			await trx('order_items').where({ order_id: orderId }).delete();
		} else {
			[orderId] = await trx('orders').insert(row);
		}
		const topIds = await insertItems(trx, orderId as number, computed.items, null);
		for (const p of input.promotions || []) {
			const [promoRowId] = await trx('order_promotions').insert({
				order_id: orderId,
				promotion_id: p.promotion_id || null,
				description: p.description,
				type: p.type || 'otro',
				store_amount: r2(p.store_amount || 0),
				platform_amount: r2(p.platform_amount || 0)
			});
			const linked = (p.item_indexes || []).map((i) => topIds[i]).filter(Boolean);
			if (linked.length) {
				await trx('order_promotion_items').insert(
					linked.map((itemId) => ({ order_promotion_id: promoRowId, order_item_id: itemId }))
				);
			}
		}
		for (const a of input.learn_aliases || []) {
			await trx('recipe_aliases')
				.insert({ alias_key: a.alias_key, recipe_id: a.recipe_id })
				.onConflict('alias_key')
				.merge({ recipe_id: a.recipe_id });
		}
		return orderId as number;
	});

export const getOrderRow = async (db: Knex, id: number): Promise<Order | undefined> =>
	db('orders').where({ id }).first();

export const previousItems = async (db: Knex, orderId: number): Promise<Map<number, OrderItemRow>> => {
	const rows: OrderItemRow[] = await db('order_items').where({ order_id: orderId });
	return new Map(rows.map((r) => [r.id, r]));
};

export const getOrder = async (db: Knex, id: number): Promise<OrderDetail | null> => {
	const order = await db('orders as o')
		.join('channels as c', 'c.id', 'o.channel_id')
		.where('o.id', id)
		.first('o.*', 'c.name as channel_name', 'c.color as channel_color');
	if (!order) return null;
	const [items, mods, promos, promoLinks] = await Promise.all([
		db('order_items').where({ order_id: id }).orderBy('sort_order').orderBy('id') as Promise<OrderItemRow[]>,
		db('order_item_modifiers as m')
			.join('order_items as i', 'i.id', 'm.order_item_id')
			.where('i.order_id', id)
			.select('m.*') as Promise<OrderModifierRow[]>,
		db('order_promotions').where({ order_id: id }) as Promise<Omit<OrderPromotionRow, 'order_item_ids'>[]>,
		db('order_promotion_items as l')
			.join('order_promotions as p', 'p.id', 'l.order_promotion_id')
			.where('p.order_id', id)
			.select('l.*') as Promise<{ order_promotion_id: number; order_item_id: number }[]>
	]);
	const build = (parent: number | null): OrderItemDetail[] =>
		items
			.filter((i) => i.parent_item_id === parent)
			.map((i) => ({ ...i, modifiers: mods.filter((m) => m.order_item_id === i.id), children: build(i.id) }));
	return {
		...order,
		items: build(null),
		promotions: promos.map((p) => ({
			...p,
			order_item_ids: promoLinks.filter((l) => l.order_promotion_id === p.id).map((l) => l.order_item_id)
		}))
	};
};

export const listOrders = async (db: Knex, f: OrderFilters, limit = 500): Promise<OrderListRow[]> => {
	const q = db('orders as o')
		.join('channels as c', 'c.id', 'o.channel_id')
		.select(
			'o.*',
			'c.name as channel_name',
			'c.color as channel_color',
			db.raw(
				`(SELECT GROUP_CONCAT(CAST(i.quantity AS INTEGER) || '× ' || i.name, ', ') FROM order_items i WHERE i.order_id = o.id AND i.parent_item_id IS NULL) AS items_summary`
			),
			db.raw(
				'(SELECT COALESCE(SUM(i.quantity), 0) FROM order_items i WHERE i.order_id = o.id AND i.parent_item_id IS NULL) AS units'
			)
		)
		.orderBy('o.ordered_at', 'desc')
		.orderBy('o.id', 'desc')
		.limit(limit);
	if (f.from) q.where('o.ordered_at', '>=', `${f.from} 00:00`);
	if (f.to) q.where('o.ordered_at', '<=', `${f.to} 23:59`);
	if (f.channel_id) q.where('o.channel_id', f.channel_id);
	if (f.status) q.where('o.status', f.status);
	if (f.search) {
		const s = `%${f.search}%`;
		q.where((w) =>
			w
				.where('o.external_ref', 'like', s)
				.orWhere('o.notes', 'like', s)
				.orWhereExists(db('order_items as i').whereRaw('i.order_id = o.id').where('i.name', 'like', s))
		);
	}
	return q;
};

export const deleteOrder = async (db: Knex, id: number): Promise<void> => {
	await db('orders').where({ id }).delete();
};

export const setStatus = async (db: Knex, id: number, status: string): Promise<void> => {
	await db('orders')
		.where({ id })
		.update({ status, updated_at: db.raw("datetime('now', 'localtime')") });
};

/** Productos más vendidos recientemente, para los accesos rápidos del formulario. */
export const favoriteRecipes = async (
	db: Knex,
	channelId: number | null,
	limit = 12
): Promise<{ recipe_id: number; units: number }[]> => {
	const q = db('order_items as i')
		.join('orders as o', 'o.id', 'i.order_id')
		.join('recipes as r', 'r.id', 'i.recipe_id')
		.whereNull('i.parent_item_id')
		.where('o.status', 'completado')
		.where('r.active', 1)
		.where('o.ordered_at', '>=', db.raw("datetime('now', 'localtime', '-60 days')"))
		.groupBy('i.recipe_id')
		.select('i.recipe_id', db.raw('SUM(i.quantity) AS units'))
		.orderBy('units', 'desc')
		.limit(limit);
	if (channelId) q.where('o.channel_id', channelId);
	return q;
};

export const loadAliases = async (db: Knex): Promise<Map<string, number>> => {
	const rows: { alias_key: string; recipe_id: number }[] = await db('recipe_aliases').select(
		'alias_key',
		'recipe_id'
	);
	return new Map(rows.map((r) => [r.alias_key, r.recipe_id]));
};

export const allModifierOptions = async (db: Knex): Promise<ModifierOption[]> => db('modifier_options').select('*');

export default {
	computeOrder,
	saveOrder,
	getOrderRow,
	previousItems,
	getOrder,
	listOrders,
	deleteOrder,
	setStatus,
	favoriteRecipes,
	loadAliases,
	allModifierOptions
};
