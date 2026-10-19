export interface Channel {
	id: number;
	code: string;
	name: string;
	commission_pct: number;
	isr_ret_pct: number;
	iva_ret_pct: number;
	target_margin_pct: number | null;
	is_platform: number;
	color: string;
	sort_order: number;
	active: number;
}

export type ChannelInput = Omit<Channel, 'id'>;

export interface AppSettings {
	iva_rate: number;
	target_margin_pct: number;
	food_cost_target_pct: number;
	price_rounding: number;
	daily_sales_goal: number;
	daily_profit_goal: number;
	backup_keep: number;
	business_name: string;
}

export type ExpenseFrequency = 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'anual';

export interface FixedExpense {
	id: number;
	name: string;
	category: string | null;
	amount: number;
	frequency: ExpenseFrequency;
	notes: string | null;
	active: number;
}

export type FixedExpenseInput = Omit<FixedExpense, 'id'>;
