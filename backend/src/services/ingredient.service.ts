import { Knex } from 'knex';
import { Ingredient, IngredientCostChange, IngredientInput, IngredientWithUsage } from '../interfaces/ingredient';

export const listIngredients = async (db: Knex): Promise<IngredientWithUsage[]> =>
	db('ingredients as i')
		.select(
			'i.*',
			db.raw(
				'(SELECT COUNT(DISTINCT ri.recipe_id) FROM recipe_items ri WHERE ri.ingredient_id = i.id) AS used_in'
			),
			db.raw(
				'(SELECT h.changed_at FROM ingredient_cost_history h WHERE h.ingredient_id = i.id ORDER BY h.id DESC LIMIT 1) AS last_change_at'
			),
			db.raw(
				'(SELECT h.old_cost FROM ingredient_cost_history h WHERE h.ingredient_id = i.id ORDER BY h.id DESC LIMIT 1) AS last_old_cost'
			)
		)
		.orderBy('i.name');

export const getIngredient = async (db: Knex, id: number): Promise<Ingredient | undefined> =>
	db('ingredients').where({ id }).first();

export const findByName = async (db: Knex, name: string): Promise<Ingredient | undefined> =>
	db('ingredients').whereRaw('name = ? COLLATE NOCASE', [name.trim()]).first();

/** Siguiente código libre tipo ING109 */
export const nextCode = async (db: Knex): Promise<string> => {
	const rows: { code: string | null }[] = await db('ingredients').select('code');
	const max = rows.reduce((acc, r) => {
		const m = (r.code || '').match(/^ING(\d+)$/);
		return m ? Math.max(acc, Number(m[1])) : acc;
	}, 0);
	return `ING${String(max + 1).padStart(3, '0')}`;
};

export const createIngredient = async (db: Knex, data: IngredientInput): Promise<number> => {
	const [id] = await db('ingredients').insert({
		...data,
		name: data.name.trim(),
		code: data.code || (await nextCode(db))
	});
	return id;
};

export const updateIngredient = async (db: Knex, id: number, data: Partial<IngredientInput>): Promise<void> => {
	const patch: Record<string, unknown> = { ...data };
	if (typeof data.name === 'string') patch.name = data.name.trim();
	await db('ingredients')
		.where({ id })
		.update({ ...patch, updated_at: db.raw("datetime('now', 'localtime')") });
};

/** Actualiza varios costos de golpe (pantalla de "actualizar precios de compra"). */
export const bulkUpdateCosts = async (db: Knex, changes: { id: number; purchase_cost: number }[]): Promise<number> => {
	let updated = 0;
	await db.transaction(async (trx) => {
		for (const c of changes) {
			updated += await trx('ingredients').where({ id: c.id }).update({ purchase_cost: c.purchase_cost });
		}
	});
	return updated;
};

export const recipesUsing = async (db: Knex, id: number): Promise<{ id: number; name: string; quantity: number }[]> =>
	db('recipe_items as ri')
		.join('recipes as r', 'r.id', 'ri.recipe_id')
		.where('ri.ingredient_id', id)
		.select('r.id', 'r.name', 'ri.quantity')
		.orderBy('r.name');

export const costHistory = async (db: Knex, id: number): Promise<IngredientCostChange[]> =>
	db('ingredient_cost_history').where({ ingredient_id: id }).orderBy('id', 'desc');

export const recentCostChanges = async (
	db: Knex,
	sinceDays: number
): Promise<(IngredientCostChange & { name: string; use_unit: string })[]> =>
	db('ingredient_cost_history as h')
		.join('ingredients as i', 'i.id', 'h.ingredient_id')
		.where('h.changed_at', '>=', db.raw(`datetime('now', 'localtime', ?)`, [`-${sinceDays} days`]))
		.select('h.*', 'i.name', 'i.use_unit')
		.orderBy('h.id', 'desc');

export const deleteIngredient = async (db: Knex, id: number): Promise<void> => {
	await db('ingredients').where({ id }).delete();
};

export default {
	listIngredients,
	getIngredient,
	findByName,
	nextCode,
	createIngredient,
	updateIngredient,
	bulkUpdateCosts,
	recipesUsing,
	costHistory,
	recentCostChanges,
	deleteIngredient
};
