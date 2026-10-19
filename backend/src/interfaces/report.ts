export interface Totals {
	orders: number;
	units: number;
	gross_amount: number;
	discount_store: number;
	net_sale: number;
	iva_amount: number;
	commission_amount: number;
	commission_iva_amount: number;
	isr_ret_amount: number;
	iva_ret_amount: number;
	cost_amount: number;
	profit_amount: number;
	payout_amount: number;
	avg_ticket: number;
	margin_pct: number;
}

export interface ChannelTotals extends Totals {
	channel_id: number;
	channel_name: string;
	color: string;
}

export interface ProductStat {
	recipe_id: number | null;
	name: string;
	category: string | null;
	units: number;
	sales: number;
	cost: number;
	profit: number;
	profit_per_unit: number;
	margin_pct: number;
}

export type MenuClass = 'estrella' | 'caballo' | 'enigma' | 'perro';

export interface MenuEngineeringRow extends ProductStat {
	popularity_pct: number;
	classification: MenuClass;
}

export interface MenuEngineering {
	rows: MenuEngineeringRow[];
	popularity_threshold: number;
	margin_threshold: number;
}

export interface DailyPoint {
	date: string;
	orders: number;
	net_sale: number;
	profit: number;
	cost: number;
	commission: number;
}

export interface HeatCell {
	weekday: number;
	hour: number;
	orders: number;
	net_sale: number;
}

export interface BreakEven {
	monthly_fixed: number;
	daily_fixed: number;
	avg_profit_per_order: number;
	avg_ticket: number;
	orders_per_day_needed: number | null;
	sales_per_day_needed: number | null;
	days_in_range: number;
	avg_orders_per_day: number;
	net_after_fixed: number;
}

export interface TaxSummary {
	iva_trasladado: number;
	iva_retenido: number;
	/** IVA que las plataformas cobran sobre su comisión (acreditable) */
	iva_acreditable_comisiones: number;
	iva_por_pagar: number;
	isr_retenido: number;
	base_sin_iva: number;
}

export interface DaySummary {
	date: string;
	totals: Totals;
	by_channel: ChannelTotals[];
	by_hour: { hour: number; orders: number; net_sale: number; profit: number }[];
	top_products: ProductStat[];
	goals: { sales: number; profit: number };
	orders: import('./order').OrderListRow[];
	compare: { label: string; totals: Totals };
}

export interface Dashboard {
	from: string;
	to: string;
	totals: Totals;
	previous: Totals;
	by_channel: ChannelTotals[];
	daily: DailyPoint[];
	by_category: { category: string; units: number; sales: number; profit: number }[];
	top_by_units: ProductStat[];
	top_by_profit: ProductStat[];
	worst_by_margin: ProductStat[];
	heatmap: HeatCell[];
	menu: MenuEngineering;
	break_even: BreakEven;
	taxes: TaxSummary;
	promotions: { description: string; times: number; store_amount: number; platform_amount: number }[];
}

export interface PricingChannelCell {
	channel_id: number;
	price: number | null;
	commission: number;
	iva: number;
	isr: number;
	profit: number | null;
	margin_pct: number | null;
	food_cost_pct: number | null;
	suggested_price: number | null;
	target_margin_pct: number;
	status: 'ok' | 'bajo' | 'perdida' | 'sin_precio';
}

export interface PricingRow {
	recipe_id: number;
	name: string;
	kind: string;
	category: string | null;
	cost_unit: number;
	packaging_unit: number;
	channels: PricingChannelCell[];
}

export type AlertLevel = 'info' | 'warning' | 'danger';

export interface Alert {
	level: AlertLevel;
	type: 'margen' | 'costo' | 'precio' | 'receta' | 'conciliacion';
	title: string;
	detail: string;
	link?: string;
}
