export type RecipeKind = 'preparacion' | 'producto_final' | 'combo';
export type YieldUnit = 'g' | 'ml' | 'pieza' | 'oz';

export interface Recipe {
	id: number;
	name: string;
	kind: RecipeKind;
	category: string | null;
	yield_qty: number;
	yield_unit: YieldUnit;
	notes: string | null;
	active: number;
	created_at: string;
	updated_at: string;
}

export interface RecipeItem {
	id: number;
	recipe_id: number;
	ingredient_id: number | null;
	sub_recipe_id: number | null;
	quantity: number;
	notes: string | null;
	sort_order: number;
}

export interface RecipeItemInput {
	ingredient_id?: number | null;
	sub_recipe_id?: number | null;
	quantity: number;
	notes?: string | null;
}

export interface RecipeInput {
	name: string;
	kind: RecipeKind;
	category?: string | null;
	yield_qty: number;
	yield_unit: YieldUnit;
	notes?: string | null;
	active?: number;
	items: RecipeItemInput[];
	modifier_group_ids?: number[];
	prices?: { channel_id: number; price: number }[];
}

/** Costo calculado de una receta (total del lote y por unidad de rendimiento). */
export interface RecipeCost {
	total: number;
	unit: number;
	/** Parte del costo unitario que corresponde a empaque */
	packaging_unit: number;
	error?: string;
}

export interface RecipeItemDetail extends RecipeItem {
	component_name: string;
	component_type: 'ingrediente' | 'receta';
	unit: string;
	unit_cost: number;
	subtotal: number;
	is_packaging: boolean;
}

export interface RecipeDetail extends Recipe {
	items: RecipeItemDetail[];
	cost: RecipeCost;
	prices: { channel_id: number; price: number }[];
	modifier_group_ids: number[];
	used_in: { id: number; name: string; kind: RecipeKind }[];
}

export interface RecipeListRow extends Recipe {
	cost_total: number;
	cost_unit: number;
	packaging_unit: number;
	items_count: number;
	cost_error?: string;
}
