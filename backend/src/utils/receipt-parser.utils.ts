import { OcrLine, OcrPage, ParsedItem, ParsedReceipt } from '../interfaces/ocr';
import { normalize } from './text.utils';
import { parseReceiptDate } from './date.utils';

/** "MX$60.00", "MXN 60 . 00", "-MX$22.50", "MXSO.00" (OCR leyó $0 como SO) */
const MONEY_RE = /(-)?\s*MX\s*N?\s*[$S5]?\s*([0-9OoIl|][0-9OoIl|\s]*(?:[.,]\s*[0-9Oo]{2})?)/i;
/** "1 x Molletes", "x Molletes" (OCR perdió el 1), "Tx Cilantro", "1xSi" */
const QTY_RE = /^(?:(\d{1,2}|[TlI|])\s*[x×X]\s*|[x×X]\s+)(.+)$/;

/** Fracción del ancho a partir de la cual el texto pertenece al panel lateral (seguimiento, repartidor) */
const SIDE_PANEL = 0.55;
/** Separación horizontal (fracción del ancho) que parte una línea en columnas */
const COLUMN_GAP = 0.04;

interface Entry {
	kind: 'item' | 'header';
	x0: number;
	text: string;
	qty: number;
	price: number;
}

export const parseMoney = (raw: string): number => {
	let s = raw.replace(/[Oo]/g, '0').replace(/[Il|]/g, '1').replace(/\s+/g, '');
	if (/,\d{2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
	else s = s.replace(/,/g, '');
	const n = Number(s);
	return Number.isFinite(n) ? n : 0;
};

const findMoney = (text: string): { index: number; value: number } | null => {
	const m = MONEY_RE.exec(text);
	if (!m) return null;
	const value = parseMoney(m[2]);
	return { index: m.index, value: m[1] ? -value : value };
};

/** Texto de la primera columna de la línea (corta donde hay un hueco grande entre palabras). */
const firstColumn = (line: OcrLine, width: number): string => {
	if (!line.words.length) return line.text.trim();
	const out = [line.words[0].text];
	for (let i = 1; i < line.words.length; i++) {
		if (line.words[i].x0 - line.words[i - 1].x1 > width * COLUMN_GAP) break;
		out.push(line.words[i].text);
	}
	return out.join(' ').trim();
};

const clusterLevels = (xs: number[], tolerance: number): number[] => {
	const levels: number[] = [];
	for (const x of [...xs].sort((a, b) => a - b)) {
		if (!levels.length || x - levels[levels.length - 1] > tolerance) levels.push(x);
	}
	return levels;
};

const levelOf = (x: number, levels: number[]): number => {
	let best = 0;
	for (let i = 1; i < levels.length; i++) {
		if (Math.abs(levels[i] - x) < Math.abs(levels[best] - x)) best = i;
	}
	return best;
};

const detectChannel = (text: string): string | null => {
	const t = normalize(text);
	if (t.includes('didi')) return 'didi';
	if (t.includes('rappi')) return 'rappi';
	if (t.includes('uber') || t.includes('delivered') || t.includes('rate pickup') || /\bmxn\b/.test(t)) return 'uber';
	return null;
};

const detectRef = (lines: OcrLine[]): string | null => {
	for (const l of lines) {
		const id = l.text.match(/\bID:?\s*(\d{8,})/i);
		if (id) return id[1];
	}
	for (const l of lines.slice(0, 5)) {
		const code = l.text.match(/[«•·*]\s*([A-Z0-9]{4,6})\b/);
		if (code) return code[1];
	}
	return null;
};

const cleanItemName = (name: string): string =>
	name
		.replace(/\s+combo$/i, '')
		.replace(/\s*[:;|]+$/, '')
		.replace(/\s+/g, ' ')
		.trim();

/**
 * Convierte el resultado del OCR de una captura de DiDi / Uber en un pedido estructurado.
 * La jerarquía (producto → modificador, combo → producto → modificador) se deduce de la sangría.
 */
export const parseReceipt = (page: OcrPage, now = new Date()): ParsedReceipt => {
	const width = page.width || 1;
	const lines = [...page.lines].sort((a, b) => a.y0 - b.y0);
	const result: ParsedReceipt = {
		channel_code: detectChannel(page.text),
		ordered_at: null,
		external_ref: detectRef(lines),
		items: [],
		subtotal: null,
		discount_store: null,
		total_after_discount: null,
		commission_amount: null,
		commission_pct: null,
		payout: null,
		warnings: []
	};

	for (const l of lines) {
		result.ordered_at = parseReceiptDate(l.text, now);
		if (result.ordered_at) break;
	}

	const entries: Entry[] = [];
	let seenItem = false;
	for (const line of lines) {
		if (line.x0 > width * SIDE_PANEL) continue;
		const text = line.text.replace(/[−–—]/g, '-').replace(/\s+/g, ' ').trim();
		const money = findMoney(text);
		const label = (money ? text.slice(0, money.index) : firstColumn(line, width)).trim();
		const key = normalize(label);

		if (money) {
			if (/precio total del producto|^subtotal/.test(key)) {
				result.subtotal ??= Math.abs(money.value);
				continue;
			}
			if (/ganancias totales despues/.test(key)) {
				result.total_after_discount ??= Math.abs(money.value);
				continue;
			}
			if (/comision|tasa del servicio|service fee|commission/.test(key)) {
				if (result.commission_amount === null) {
					result.commission_amount = Math.abs(money.value);
					const pct = text.match(/(\d{1,2}(?:[.,]\d+)?)\s*%/);
					if (pct) result.commission_pct = Number(pct[1].replace(',', '.')) / 100;
				}
				continue;
			}
			if (/ganancias por pedido|payout|ganancia neta/.test(key)) {
				result.payout ??= Math.abs(money.value);
				continue;
			}
			if (/promocion|descuento|promotion|discount/.test(key)) {
				result.discount_store ??= Math.abs(money.value);
				continue;
			}
			if (/^total\b/.test(key)) {
				result.total_after_discount ??= Math.abs(money.value);
				continue;
			}
			if (/cargos de|efectivo recibido|monto del recibo|propina|tip\b|envio|delivery fee/.test(key)) continue;
		}

		const qty = label.match(QTY_RE);
		if (qty && money) {
			const q = qty[1] && /^\d+$/.test(qty[1]) ? Number(qty[1]) : 1;
			entries.push({ kind: 'item', x0: line.x0, text: cleanItemName(qty[2]), qty: q, price: money.value });
			seenItem = true;
		} else if (
			!money &&
			seenItem &&
			label &&
			!/^(cantidad de paquetes|proporciona tu evidencia|notas del pedido)/.test(key)
		) {
			entries.push({ kind: 'header', x0: line.x0, text: label, qty: 0, price: 0 });
		}
	}

	const itemXs = entries.filter((e) => e.kind === 'item').map((e) => e.x0);
	if (!itemXs.length) {
		result.warnings.push('No se encontraron productos en la captura');
		return result;
	}
	const levels = clusterLevels(itemXs, width * 0.012);

	// Un producto de primer nivel es combo si lo dice o si tiene descendientes en un tercer nivel
	const isCombo = new Map<number, boolean>();
	entries.forEach((e, idx) => {
		if (e.kind !== 'item' || levelOf(e.x0, levels) !== 0) return;
		let combo = /combo/i.test(e.text);
		for (let j = idx + 1; j < entries.length && !combo; j++) {
			const next = entries[j];
			if (next.kind !== 'item') continue;
			const lvl = levelOf(next.x0, levels);
			if (lvl === 0) break;
			if (lvl >= 2) combo = true;
		}
		isCombo.set(idx, combo);
	});

	let top: ParsedItem | null = null;
	let child: ParsedItem | null = null;
	let group: string | null = null;
	entries.forEach((e, idx) => {
		if (e.kind === 'header') {
			group = e.text;
			return;
		}
		const lvl = levelOf(e.x0, levels);
		if (lvl === 0 || !top) {
			top = {
				name: e.text,
				quantity: e.qty,
				price: e.price,
				is_combo: !!isCombo.get(idx),
				modifiers: [],
				children: []
			};
			result.items.push(top);
			child = null;
			group = null;
			return;
		}
		if (lvl === 1 && top.is_combo) {
			child = { name: e.text, quantity: e.qty, price: e.price, is_combo: false, modifiers: [], children: [] };
			top.children.push(child);
			group = null;
			return;
		}
		const owner: ParsedItem = lvl >= 2 && child ? child : top;
		owner.modifiers.push({ group_name: group, name: e.text, quantity: e.qty, price: e.price });
	});

	const sum = result.items.reduce(
		(acc, it) =>
			acc +
			it.price +
			it.modifiers.reduce((a, m) => a + m.price, 0) +
			it.children.reduce((a, c) => a + c.price + c.modifiers.reduce((b, m) => b + m.price, 0), 0),
		0
	);
	if (result.subtotal !== null && Math.abs(sum - result.subtotal) > 0.5) {
		result.warnings.push(
			`La suma de productos leídos ($${sum.toFixed(2)}) no coincide con el subtotal del ticket ($${result.subtotal.toFixed(2)}). Revisa cantidades y precios.`
		);
	}
	if (!result.channel_code) result.warnings.push('No se pudo identificar la plataforma; selecciónala manualmente');
	if (!result.ordered_at) result.warnings.push('No se encontró la fecha; se usará la fecha y hora actual');
	return result;
};

export default { parseReceipt, parseMoney };
