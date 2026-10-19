export type PromotionType = 'porcentaje' | 'monto_fijo' | '2x1' | 'precio_especial' | 'producto_gratis' | 'otro';
export type PromotionAbsorber = 'tienda' | 'plataforma' | 'compartido';

export interface Promotion {
	id: number;
	name: string;
	type: PromotionType;
	value: number;
	absorbed_by: PromotionAbsorber;
	store_share_pct: number;
	channel_id: number | null;
	starts_on: string | null;
	ends_on: string | null;
	notes: string | null;
	active: number;
	created_at: string;
}

export interface PromotionDetail extends Promotion {
	recipe_ids: number[];
	times_used: number;
	store_cost: number;
}

export interface PromotionInput extends Omit<Promotion, 'id' | 'created_at'> {
	recipe_ids: number[];
}
