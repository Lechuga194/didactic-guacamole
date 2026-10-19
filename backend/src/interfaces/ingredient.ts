export type PurchaseUnit = 'kg' | 'L' | 'pieza';
export type IngredientCategory = 'insumo' | 'empaque';
export type PurchaseSource = 'linea' | 'local';

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
	/** 1 = el precio de compra fluctúa mucho (sólo indicador visual) */
	price_volatile: number;
	/** 1 = pendiente de revisar (sólo indicador visual) */
	needs_review: number;
	/** Dónde se compra: en línea (por defecto) o local (sólo indicador visual) */
	purchase_source: PurchaseSource;
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
	price_volatile?: number;
	needs_review?: number;
	purchase_source?: PurchaseSource;
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
