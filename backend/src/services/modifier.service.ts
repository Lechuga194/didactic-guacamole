import { Knex } from 'knex';
import {
	ModifierGroup,
	ModifierGroupDetail,
	ModifierGroupInput,
	ModifierOption,
	ModifierOptionWithCost
} from '../interfaces/modifier';
import recipeService, { CostContext } from './recipe.service';

/** Costo de una opción: ingrediente o sub-receta por cantidad, más costo fijo. */
export const optionCost = (opt: ModifierOption, ctx: CostContext): number => {
	let cost = opt.fixed_cost || 0;
	if (opt.ingredient_id) {
		const ing = ctx.ingredients.find((i) => i.id === opt.ingredient_id);
		cost += (ing?.unit_cost || 0) * (opt.quantity || 0);
	} else if (opt.sub_recipe_id) {
		cost += recipeService.costOf(ctx, opt.sub_recipe_id).unit * (opt.quantity || 0);
	}
	return cost;
};

export const listGroups = async (db: Knex, ctx?: CostContext): Promise<ModifierGroupDetail[]> => {
	const context = ctx || (await recipeService.loadCostContext(db));
	const [groups, options, links] = await Promise.all([
		db('modifier_groups').select('*').orderBy('name') as Promise<ModifierGroup[]>,
		db('modifier_options').select('*').orderBy('id') as Promise<ModifierOption[]>,
		db('recipe_modifier_groups').select('*') as Promise<{ recipe_id: number; group_id: number }[]>
	]);
	return groups.map((g) => ({
		...g,
		options: options
			.filter((o) => o.group_id === g.id)
			.map((o): ModifierOptionWithCost => ({
				...o,
				cost: optionCost(o, context),
				component_name: o.ingredient_id
					? context.ingredients.find((i) => i.id === o.ingredient_id)?.name || null
					: o.sub_recipe_id
						? context.recipes.find((r) => r.id === o.sub_recipe_id)?.name || null
						: null
			})),
		recipe_ids: links.filter((l) => l.group_id === g.id).map((l) => l.recipe_id)
	}));
};

export const findGroupByName = async (
	db: Knex,
	name: string,
	exceptId?: number
): Promise<ModifierGroup | undefined> => {
	const q = db('modifier_groups').whereRaw('name = ? COLLATE NOCASE', [name.trim()]);
	if (exceptId) q.whereNot({ id: exceptId });
	return q.first();
};

export const saveGroup = async (db: Knex, data: ModifierGroupInput, id?: number): Promise<number> =>
	db.transaction(async (trx) => {
		const row = { name: data.name.trim(), defines_variant: data.defines_variant, notes: data.notes ?? null };
		let groupId = id;
		if (groupId) await trx('modifier_groups').where({ id: groupId }).update(row);
		else [groupId] = await trx('modifier_groups').insert(row);

		const keep: number[] = [];
		for (const o of data.options) {
			const optRow = {
				group_id: groupId,
				name: o.name.trim(),
				price_delta: o.price_delta || 0,
				ingredient_id: o.ingredient_id || null,
				sub_recipe_id: o.ingredient_id ? null : o.sub_recipe_id || null,
				quantity: o.quantity || 0,
				fixed_cost: o.fixed_cost || 0,
				active: o.active ?? 1
			};
			if (o.id) {
				await trx('modifier_options').where({ id: o.id, group_id: groupId }).update(optRow);
				keep.push(o.id);
			} else {
				const [newId] = await trx('modifier_options').insert(optRow);
				keep.push(newId);
			}
		}
		const del = trx('modifier_options').where({ group_id: groupId });
		if (keep.length) del.whereNotIn('id', keep);
		await del.delete();

		if (data.recipe_ids) {
			await trx('recipe_modifier_groups').where({ group_id: groupId }).delete();
			if (data.recipe_ids.length) {
				await trx('recipe_modifier_groups').insert(
					data.recipe_ids.map((r) => ({ recipe_id: r, group_id: groupId }))
				);
			}
		}
		return groupId as number;
	});

export const deleteGroup = async (db: Knex, id: number): Promise<void> => {
	await db('modifier_groups').where({ id }).delete();
};

export default { optionCost, listGroups, findGroupByName, saveGroup, deleteGroup };
