export interface OcrWord {
	text: string;
	x0: number;
	x1: number;
}

export interface OcrLine {
	text: string;
	x0: number;
	y0: number;
	words: OcrWord[];
}

export interface OcrPage {
	width: number;
	height: number;
	lines: OcrLine[];
	text: string;
}

export interface ParsedModifier {
	group_name: string | null;
	name: string;
	quantity: number;
	price: number;
}

export interface ParsedItem {
	name: string;
	quantity: number;
	price: number;
	is_combo: boolean;
	modifiers: ParsedModifier[];
	children: ParsedItem[];
}

/** Resultado del parser de texto (sin conocer el catálogo) */
export interface ParsedReceipt {
	channel_code: string | null;
	ordered_at: string | null;
	external_ref: string | null;
	items: ParsedItem[];
	subtotal: number | null;
	discount_store: number | null;
	total_after_discount: number | null;
	commission_amount: number | null;
	commission_pct: number | null;
	payout: number | null;
	warnings: string[];
}

export type MatchConfidence = 'alta' | 'media' | 'baja' | 'ninguna';

export interface DraftModifier {
	modifier_option_id: number | null;
	group_name: string | null;
	name: string;
	quantity: number;
	price_delta: number;
	cost_delta: number;
}

export interface DraftItem {
	raw_name: string;
	recipe_id: number | null;
	recipe_name: string | null;
	confidence: MatchConfidence;
	alias_key: string;
	name: string;
	quantity: number;
	unit_price: number;
	modifiers: DraftModifier[];
	children: DraftItem[];
	candidates: { recipe_id: number; name: string; score: number }[];
}

/** Borrador de pedido listo para que el usuario lo revise en el formulario */
export interface OrderDraft {
	channel_id: number | null;
	channel_code: string | null;
	ordered_at: string | null;
	external_ref: string | null;
	items: DraftItem[];
	discount_store: number;
	subtotal: number | null;
	commission_amount: number | null;
	commission_pct: number | null;
	reported_payout: number | null;
	warnings: string[];
	raw_text: string;
}
