export type OrderStatus = 'completado' | 'cancelado';
export type OrderSource = 'manual' | 'ocr';

export interface OrderModifierInput {
	modifier_option_id?: number | null;
	group_name?: string | null;
	name: string;
	quantity?: number;
	price_delta: number;
	/** Sólo se usa si no hay modifier_option_id (costo capturado a mano) */
	cost_delta?: number;
}

export interface OrderItemInput {
	/** id de order_items al editar; conserva el costo histórico si la receta no cambió */
	id?: number;
	recipe_id: number | null;
	name: string;
	quantity: number;
	unit_price: number;
	modifiers?: OrderModifierInput[];
	children?: OrderItemInput[];
}

export interface OrderPromotionInput {
	promotion_id?: number | null;
	description: string;
	type?: string;
	store_amount: number;
	platform_amount?: number;
	/** Índices (en items de primer nivel) de los productos incluidos en la promoción */
	item_indexes?: number[];
}

export interface OrderInput {
	channel_id: number;
	ordered_at: string;
	external_ref?: string | null;
	status?: OrderStatus;
	source?: OrderSource;
	notes?: string | null;
	reported_payout?: number | null;
	items: OrderItemInput[];
	promotions?: OrderPromotionInput[];
	learn_aliases?: { alias_key: string; recipe_id: number }[];
}

export interface Order {
	id: number;
	channel_id: number;
	ordered_at: string;
	external_ref: string | null;
	status: OrderStatus;
	source: OrderSource;
	gross_amount: number;
	discount_store: number;
	discount_platform: number;
	net_sale: number;
	iva_rate: number;
	iva_amount: number;
	commission_pct: number;
	commission_amount: number;
	commission_iva_amount: number;
	isr_ret_pct: number;
	isr_ret_amount: number;
	iva_ret_pct: number;
	iva_ret_amount: number;
	cost_amount: number;
	profit_amount: number;
	payout_amount: number;
	reported_payout: number | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface OrderItemRow {
	id: number;
	order_id: number;
	parent_item_id: number | null;
	recipe_id: number | null;
	name: string;
	quantity: number;
	unit_price: number;
	modifiers_price: number;
	line_total: number;
	recipe_cost: number;
	unit_cost: number;
	line_cost: number;
	sort_order: number;
}

export interface OrderModifierRow {
	id: number;
	order_item_id: number;
	modifier_option_id: number | null;
	group_name: string | null;
	name: string;
	quantity: number;
	price_delta: number;
	cost_delta: number;
}

export interface OrderPromotionRow {
	id: number;
	order_id: number;
	promotion_id: number | null;
	description: string;
	type: string;
	store_amount: number;
	platform_amount: number;
	order_item_ids: number[];
}

export interface OrderItemDetail extends OrderItemRow {
	modifiers: OrderModifierRow[];
	children: OrderItemDetail[];
}

export interface OrderDetail extends Order {
	channel_name: string;
	channel_color: string;
	items: OrderItemDetail[];
	promotions: OrderPromotionRow[];
}

export interface OrderListRow extends Order {
	channel_name: string;
	channel_color: string;
	items_summary: string;
	units: number;
}

export interface OrderFilters {
	from?: string;
	to?: string;
	channel_id?: number;
	status?: OrderStatus;
	search?: string;
}

/** Desglose financiero de un pedido */
export interface OrderTotals {
	gross_amount: number;
	discount_store: number;
	discount_platform: number;
	net_sale: number;
	iva_rate: number;
	iva_amount: number;
	commission_pct: number;
	commission_amount: number;
	commission_iva_amount: number;
	isr_ret_pct: number;
	isr_ret_amount: number;
	iva_ret_pct: number;
	iva_ret_amount: number;
	cost_amount: number;
	profit_amount: number;
	payout_amount: number;
}
