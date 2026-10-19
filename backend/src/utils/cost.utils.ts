import { Ingredient } from '../interfaces/ingredient';
import { Recipe, RecipeCost, RecipeItem } from '../interfaces/recipe';

type CostIngredient = Pick<Ingredient, 'id' | 'unit_cost' | 'category'>;
type CostRecipe = Pick<Recipe, 'id' | 'name' | 'yield_qty'>;
type CostItem = Pick<RecipeItem, 'recipe_id' | 'ingredient_id' | 'sub_recipe_id' | 'quantity'>;

/**
 * Calcula el costo de todas las recetas resolviendo sub-recetas de forma recursiva.
 * Si existe un ciclo (A usa B y B usa A) la receta queda con costo 0 y un error.
 */
export const computeRecipeCosts = (
	recipes: CostRecipe[],
	items: CostItem[],
	ingredients: CostIngredient[]
): Map<number, RecipeCost> => {
	const ingById = new Map(ingredients.map((i) => [i.id, i]));
	const recipeById = new Map(recipes.map((r) => [r.id, r]));
	const itemsByRecipe = new Map<number, CostItem[]>();
	for (const it of items) {
		const list = itemsByRecipe.get(it.recipe_id) || [];
		list.push(it);
		itemsByRecipe.set(it.recipe_id, list);
	}

	const memo = new Map<number, RecipeCost>();
	const visiting = new Set<number>();

	const resolve = (id: number): RecipeCost => {
		const cached = memo.get(id);
		if (cached) return cached;
		const recipe = recipeById.get(id);
		if (!recipe) return { total: 0, unit: 0, packaging_unit: 0, error: 'Receta inexistente' };
		if (visiting.has(id))
			return { total: 0, unit: 0, packaging_unit: 0, error: `Ciclo detectado en ${recipe.name}` };
		visiting.add(id);

		let total = 0;
		let packaging = 0;
		let error: string | undefined;
		for (const it of itemsByRecipe.get(id) || []) {
			if (it.ingredient_id) {
				const ing = ingById.get(it.ingredient_id);
				const sub = (ing?.unit_cost || 0) * it.quantity;
				total += sub;
				if (ing?.category === 'empaque') packaging += sub;
			} else if (it.sub_recipe_id) {
				const subCost = resolve(it.sub_recipe_id);
				if (subCost.error) error = subCost.error;
				total += subCost.unit * it.quantity;
				packaging += subCost.packaging_unit * it.quantity;
			}
		}
		visiting.delete(id);
		const yieldQty = recipe.yield_qty > 0 ? recipe.yield_qty : 1;
		const result: RecipeCost = { total, unit: total / yieldQty, packaging_unit: packaging / yieldQty };
		if (error) result.error = error;
		memo.set(id, result);
		return result;
	};

	for (const r of recipes) resolve(r.id);
	return memo;
};

/** ¿Agregar sub_recipe_id dentro de recipe_id generaría un ciclo? */
export const createsCycle = (recipeId: number, subRecipeId: number, items: CostItem[]): boolean => {
	if (recipeId === subRecipeId) return true;
	const children = new Map<number, number[]>();
	for (const it of items) {
		if (!it.sub_recipe_id) continue;
		children.set(it.recipe_id, [...(children.get(it.recipe_id) || []), it.sub_recipe_id]);
	}
	const stack = [subRecipeId];
	const seen = new Set<number>();
	while (stack.length) {
		const current = stack.pop() as number;
		if (current === recipeId) return true;
		if (seen.has(current)) continue;
		seen.add(current);
		stack.push(...(children.get(current) || []));
	}
	return false;
};

export default { computeRecipeCosts, createsCycle };
