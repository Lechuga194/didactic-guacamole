import { Knex } from 'knex';
import { Ingredient } from '../interfaces/ingredient';
import {
	Recipe,
	RecipeCost,
	RecipeDetail,
	RecipeInput,
	RecipeItem,
	RecipeItemDetail,
	RecipeListRow
} from '../interfaces/recipe';
import costUtils from '../utils/cost.utils';

export interface CostContext {
	recipes: Recipe[];
	items: RecipeItem[];
	ingredients: Ingredient[];
	costs: Map<number, RecipeCost>;
}

const EMPTY_COST: RecipeCost = { total: 0, unit: 0, packaging_unit: 0 };

/** Carga todo el catálogo y calcula el costo actual de cada receta. */
export const loadCostContext = async (db: Knex): Promise<CostContext> => {
	const [recipes, items, ingredients] = await Promise.all([
		db('recipes').select('*') as Promise<Recipe[]>,
		db('recipe_items').select('*').orderBy('sort_order').orderBy('id') as Promise<RecipeItem[]>,
		db('ingredients').select('*') as Promise<Ingredient[]>
	]);
	return { recipes, items, ingredients, costs: costUtils.computeRecipeCosts(recipes, items, ingredients) };
};

export const costOf = (ctx: CostContext, recipeId: number | null | undefined): RecipeCost =>
	(recipeId && ctx.costs.get(recipeId)) || EMPTY_COST;

export const listRecipes = async (db: Knex): Promise<RecipeListRow[]> => {
	const ctx = await loadCostContext(db);
	const counts = new Map<number, number>();
	for (const it of ctx.items) counts.set(it.recipe_id, (counts.get(it.recipe_id) || 0) + 1);
	return ctx.recipes
		.map((r) => {
			const c = costOf(ctx, r.id);
			const row: RecipeListRow = {
				...r,
				cost_total: c.total,
				cost_unit: c.unit,
				packaging_unit: c.packaging_unit,
				items_count: counts.get(r.id) || 0
			};
			if (c.error) row.cost_error = c.error;
			return row;
		})
		.sort((a, b) => a.name.localeCompare(b.name, 'es'));
};

const unitLabel = (r: Recipe): string => (r.yield_unit === 'oz' ? 'oz' : r.yield_unit);

export const getRecipeDetail = async (db: Knex, id: number): Promise<RecipeDetail | null> => {
	const ctx = await loadCostContext(db);
	const recipe = ctx.recipes.find((r) => r.id === id);
	if (!recipe) return null;
	const ingById = new Map(ctx.ingredients.map((i) => [i.id, i]));
	const recById = new Map(ctx.recipes.map((r) => [r.id, r]));

	const items: RecipeItemDetail[] = ctx.items
		.filter((it) => it.recipe_id === id)
		.map((it) => {
			if (it.ingredient_id) {
				const ing = ingById.get(it.ingredient_id);
				return {
					...it,
					component_name: ing?.name || '¿?',
					component_type: 'ingrediente',
					unit: ing?.use_unit || '',
					unit_cost: ing?.unit_cost || 0,
					subtotal: (ing?.unit_cost || 0) * it.quantity,
					is_packaging: ing?.category === 'empaque'
				};
			}
			const sub = recById.get(it.sub_recipe_id as number);
			const c = costOf(ctx, it.sub_recipe_id);
			return {
				...it,
				component_name: sub?.name || '¿?',
				component_type: 'receta',
				unit: sub ? unitLabel(sub) : '',
				unit_cost: c.unit,
				subtotal: c.unit * it.quantity,
				is_packaging: false
			};
		});

	const [prices, groups] = await Promise.all([
		db('recipe_prices').where({ recipe_id: id }).select('channel_id', 'price'),
		db('recipe_modifier_groups').where({ recipe_id: id }).pluck('group_id')
	]);
	const usedIn = ctx.items
		.filter((it) => it.sub_recipe_id === id)
		.map((it) => recById.get(it.recipe_id))
		.filter((r): r is Recipe => !!r)
		.map((r) => ({ id: r.id, name: r.name, kind: r.kind }));

	return {
		...recipe,
		items,
		cost: costOf(ctx, id),
		prices,
		modifier_group_ids: groups,
		used_in: [...new Map(usedIn.map((u) => [u.id, u])).values()]
	};
};

export const findByName = async (db: Knex, name: string, exceptId?: number): Promise<Recipe | undefined> => {
	const q = db('recipes').whereRaw('name = ? COLLATE NOCASE', [name.trim()]);
	if (exceptId) q.whereNot({ id: exceptId });
	return q.first();
};

/** Valida que ninguna sub-receta genere ciclo. Devuelve el nombre conflictivo o null. */
export const findCycle = async (db: Knex, recipeId: number | null, subIds: number[]): Promise<string | null> => {
	if (!recipeId || !subIds.length) return null;
	const items: RecipeItem[] = await db('recipe_items').whereNot({ recipe_id: recipeId }).select('*');
	for (const sub of subIds) {
		if (costUtils.createsCycle(recipeId, sub, items)) {
			const r = await db('recipes').where({ id: sub }).first('name');
			return r?.name || String(sub);
		}
	}
	return null;
};

export const saveRecipe = async (db: Knex, data: RecipeInput, id?: number): Promise<number> =>
	db.transaction(async (trx) => {
		const row = {
			name: data.name.trim(),
			kind: data.kind,
			category: data.category ?? null,
			yield_qty: data.yield_qty,
			yield_unit: data.yield_unit,
			notes: data.notes ?? null,
			active: data.active ?? 1
		};
		let recipeId = id;
		if (recipeId) {
			await trx('recipes')
				.where({ id: recipeId })
				.update({ ...row, updated_at: trx.raw("datetime('now', 'localtime')") });
			await trx('recipe_items').where({ recipe_id: recipeId }).delete();
		} else {
			[recipeId] = await trx('recipes').insert(row);
		}
		if (data.items.length) {
			await trx('recipe_items').insert(
				data.items.map((it, idx) => ({
					recipe_id: recipeId,
					ingredient_id: it.ingredient_id || null,
					sub_recipe_id: it.sub_recipe_id || null,
					quantity: it.quantity,
					notes: it.notes ?? null,
					sort_order: idx
				}))
			);
		}
		if (data.modifier_group_ids) {
			await trx('recipe_modifier_groups').where({ recipe_id: recipeId }).delete();
			if (data.modifier_group_ids.length) {
				await trx('recipe_modifier_groups').insert(
					data.modifier_group_ids.map((g) => ({ recipe_id: recipeId, group_id: g }))
				);
			}
		}
		for (const p of data.prices || []) {
			await upsertPrice(trx, recipeId as number, p.channel_id, p.price);
		}
		return recipeId as number;
	});

export const upsertPrice = async (
	db: Knex,
	recipeId: number,
	channelId: number,
	price: number | null
): Promise<void> => {
	if (price === null || price === undefined) {
		await db('recipe_prices').where({ recipe_id: recipeId, channel_id: channelId }).delete();
		return;
	}
	await db('recipe_prices')
		.insert({ recipe_id: recipeId, channel_id: channelId, price })
		.onConflict(['recipe_id', 'channel_id'])
		.merge({ price, updated_at: db.raw("datetime('now', 'localtime')") });
};

export const usage = async (db: Knex, id: number): Promise<{ as_component: number; in_orders: number }> => {
	const [comp, orders] = await Promise.all([
		db('recipe_items').where({ sub_recipe_id: id }).count({ n: '*' }).first(),
		db('order_items').where({ recipe_id: id }).count({ n: '*' }).first()
	]);
	return { as_component: Number(comp?.n || 0), in_orders: Number(orders?.n || 0) };
};

export const deleteRecipe = async (db: Knex, id: number): Promise<void> => {
	await db('recipes').where({ id }).delete();
};

export const setActive = async (db: Knex, id: number, active: number): Promise<void> => {
	await db('recipes').where({ id }).update({ active });
};

/** Copia una receta (componentes, precios y modificadores) con otro nombre. */
export const duplicateRecipe = async (db: Knex, id: number, name: string): Promise<number> =>
	db.transaction(async (trx) => {
		const src: Recipe = await trx('recipes').where({ id }).first();
		const [newId] = await trx('recipes').insert({
			name,
			kind: src.kind,
			category: src.category,
			yield_qty: src.yield_qty,
			yield_unit: src.yield_unit,
			notes: src.notes
		});
		const items: RecipeItem[] = await trx('recipe_items').where({ recipe_id: id });
		if (items.length) {
			await trx('recipe_items').insert(
				items.map((it) => ({
					recipe_id: newId,
					ingredient_id: it.ingredient_id,
					sub_recipe_id: it.sub_recipe_id,
					quantity: it.quantity,
					notes: it.notes,
					sort_order: it.sort_order
				}))
			);
		}
		const prices = await trx('recipe_prices').where({ recipe_id: id }).select('channel_id', 'price');
		if (prices.length) await trx('recipe_prices').insert(prices.map((p) => ({ ...p, recipe_id: newId })));
		const groups = await trx('recipe_modifier_groups').where({ recipe_id: id }).pluck('group_id');
		if (groups.length) {
			await trx('recipe_modifier_groups').insert(groups.map((g: number) => ({ recipe_id: newId, group_id: g })));
		}
		return newId;
	});

export const listCategories = async (db: Knex): Promise<string[]> =>
	db('recipes').whereNotNull('category').distinct('category').orderBy('category').pluck('category');

export default {
	loadCostContext,
	costOf,
	listRecipes,
	getRecipeDetail,
	findByName,
	findCycle,
	saveRecipe,
	upsertPrice,
	usage,
	deleteRecipe,
	setActive,
	duplicateRecipe,
	listCategories
};
