export type PurchaseUnit = 'kg' | 'L' | 'pieza';
export type IngredientCategory = 'insumo' | 'empaque';

export interface Ingredient {
	id: number;
	code: string | null;
	name: string;
	category: IngredientCategory;
	purchase_unit: PurchaseUnit;
	purchase_cost: number;
	use_unit: 'g' | 'ml' | 'pieza';
	unit_cost: number;
	notes: string | null;
	active: number;
	created_at: string;
	updated_at: string;
}

export interface IngredientInput {
	code?: string | null;
	name: string;
	category: IngredientCategory;
	purchase_unit: PurchaseUnit;
	purchase_cost: number;
	notes?: string | null;
	active?: number;
}

export interface IngredientWithUsage extends Ingredient {
	used_in: number;
	last_change_at: string | null;
	last_old_cost: number | null;
}

export interface IngredientCostChange {
	id: number;
	ingredient_id: number;
	old_cost: number | null;
	new_cost: number;
	changed_at: string;
}
