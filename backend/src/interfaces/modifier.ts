export interface ModifierGroup {
	id: number;
	name: string;
	defines_variant: number;
	notes: string | null;
}

export interface ModifierOption {
	id: number;
	group_id: number;
	name: string;
	price_delta: number;
	ingredient_id: number | null;
	sub_recipe_id: number | null;
	quantity: number;
	fixed_cost: number;
	active: number;
}

export interface ModifierOptionWithCost extends ModifierOption {
	cost: number;
	component_name: string | null;
}

export interface ModifierGroupDetail extends ModifierGroup {
	options: ModifierOptionWithCost[];
	recipe_ids: number[];
}

export interface ModifierOptionInput {
	id?: number;
	name: string;
	price_delta: number;
	ingredient_id?: number | null;
	sub_recipe_id?: number | null;
	quantity?: number;
	fixed_cost?: number;
	active?: number;
}

export interface ModifierGroupInput {
	name: string;
	defines_variant: number;
	notes?: string | null;
	options: ModifierOptionInput[];
	recipe_ids?: number[];
}
