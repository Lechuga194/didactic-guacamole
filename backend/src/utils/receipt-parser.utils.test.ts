import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OcrLine, OcrPage } from '../interfaces/ocr';
import parser from './receipt-parser.utils';
import match from './match.utils';

/** Construye una línea OCR; las columnas separadas por "||" quedan a la x indicada. */
const line = (x0: number, y0: number, text: string, cols: number[] = []): OcrLine => {
	const parts = text.split('||').map((p) => p.trim());
	const words = parts.flatMap((part, idx) => {
		let x = idx === 0 ? x0 : cols[idx - 1];
		return part.split(' ').map((w) => {
			const word = { text: w, x0: x, x1: x + w.length * 15 };
			x = word.x1 + 10;
			return word;
		});
	});
	return { text: parts.join(' '), x0, y0, words };
};

const page = (width: number, lines: OcrLine[]): OcrPage => ({
	width,
	height: 2000,
	lines,
	text: lines.map((l) => l.text).join('\n')
});

const NOW = new Date(2026, 9, 18, 12, 0);

test('ticket DiDi con producto y modificadores', () => {
	const r = parser.parseReceipt(
		page(3840, [
			line(3385, 227, '15 de oct, 10:58 am'),
			line(66, 438, 'x Molletes || MX$60.00', [3270]),
			line(140, 499, 'Tipo de mollete || 15 de oct, 11:14 am', [3385]),
			line(136, 545, 'x Tocino || MX$15.00 Llegó a la ubicación del usuario', [3270]),
			line(136, 602, '¿Deseas pico de gallo?'),
			line(136, 650, 'x Si || MX$0.00', [3270]),
			line(51, 777, 'Precio total del producto sin promoción O || MX$75.00', [3200]),
			line(51, 975, 'Cargos de DiDi O || -MX$22.50', [3200]),
			line(121, 1027, 'Comisión y distribución (Tasa del servicio 30%) || -MX$22.50', [3200]),
			line(51, 1140, 'Ganancias por pedido O || MX$52.50', [3200]),
			line(52, 1656, 'ID: 5764691172303899277')
		]),
		NOW
	);
	assert.equal(r.channel_code, 'didi');
	assert.equal(r.ordered_at, '2026-10-15 10:58');
	assert.equal(r.external_ref, '5764691172303899277');
	assert.equal(r.items.length, 1);
	assert.equal(r.items[0].name, 'Molletes');
	assert.deepEqual(
		r.items[0].modifiers.map((m) => [m.group_name, m.name, m.price]),
		[
			['Tipo de mollete', 'Tocino', 15],
			['¿Deseas pico de gallo?', 'Si', 0]
		]
	);
	assert.equal(r.subtotal, 75);
	assert.equal(r.commission_amount, 22.5);
	assert.equal(r.commission_pct, 0.3);
	assert.equal(r.payout, 52.5);
	assert.deepEqual(r.warnings, []);
});

test('ticket DiDi con combo y promoción de tienda', () => {
	const r = parser.parseReceipt(
		page(3840, [
			line(66, 361, 'x Combo Desayuno combo || MX$180.00', [3240]),
			line(136, 414, 'x Chilaquiles || MX$0.00', [3270]),
			line(206, 511, 'x Cebolla || MX$0.00', [3270]),
			line(207, 712, 'Proteina chilaquiles || 18 de oct, 9:50 am', [3385]),
			line(206, 762, 'x Pollo (130g) || MX$0.00', [3270]),
			line(136, 902, 'x Americano || MX$0.00', [3270]),
			line(206, 1008, 'x Sin endulzantes || MX$0.00', [3270]),
			line(52, 1125, 'Precio total del producto sin promoción O || MX$180.00', [3200]),
			line(51, 1198, 'Costo de promoción de productos de la tienda O || -MX$30.00', [3200]),
			line(85, 1250, 'Y Inversión de promoción de productos de la tienda || -MX$30.00', [3200])
		]),
		NOW
	);
	assert.equal(r.items.length, 1);
	const combo = r.items[0];
	assert.equal(combo.name, 'Combo Desayuno');
	assert.equal(combo.is_combo, true);
	assert.deepEqual(
		combo.children.map((c) => c.name),
		['Chilaquiles', 'Americano']
	);
	assert.deepEqual(
		combo.children[0].modifiers.map((m) => m.name),
		['Cebolla', 'Pollo (130g)']
	);
	assert.equal(combo.children[0].modifiers[1].group_name, 'Proteina chilaquiles');
	assert.equal(r.discount_store, 30);
});

test('ticket Uber en inglés con montos con espacios', () => {
	const r = parser.parseReceipt(
		page(2505, [
			line(43, 63, 'x Cliente N. « E468E = Delivered'),
			line(1749, 145, 'Oct 05, 2026, 4 PM'),
			line(178, 365, '1 x Sincronizadas || MXN 60 . 00 : 1e 97%', [1245]),
			line(281, 484, 'Pico de gallo || Rate pickup', [2000]),
			line(279, 549, '1xSi || MXN 0.00', [1270]),
			line(178, 716, '1 x Sandwich || MXN 120.00 :', [1220]),
			line(281, 826, 'Proteina Sándwich'),
			line(279, 891, '1 x Atún || MXN 20.00', [1245]),
			line(1072, 1212, 'Subtotal MX$200.00'),
			line(1138, 1282, 'Total MX$200.00')
		]),
		NOW
	);
	assert.equal(r.channel_code, 'uber');
	assert.equal(r.ordered_at, '2026-10-05 16:00');
	assert.equal(r.external_ref, 'E468E');
	assert.deepEqual(
		r.items.map((i) => [i.name, i.price]),
		[
			['Sincronizadas', 60],
			['Sandwich', 120]
		]
	);
	assert.equal(r.items[1].modifiers[0].name, 'Atún');
	assert.equal(r.items[1].modifiers[0].price, 20);
	assert.equal(r.subtotal, 200);
	assert.deepEqual(r.warnings, []);
});

test('errores típicos de OCR en montos', () => {
	assert.equal(parser.parseMoney('SO.00'.replace('S', '')), 0);
	assert.equal(parser.parseMoney('6O . 0O'), 60);
	assert.equal(parser.parseMoney('1,250.50'), 1250.5);
});

test('emparejamiento de producto con variantes', () => {
	const recipes = [
		{ id: 1, name: 'molletes' },
		{ id: 2, name: 'molletes de tocino' },
		{ id: 3, name: 'Chilaquiles verdes pollo' },
		{ id: 4, name: 'Chilaquiles queso pollo' }
	];
	assert.equal(match.bestMatch('Molletes', ['Tocino'], recipes, new Map()).recipe_id, 2);
	assert.equal(match.bestMatch('Molletes', [], recipes, new Map()).recipe_id, 1);
	assert.equal(match.bestMatch('Chilaquiles', ['Pollo (130g)', 'Verde hoja santa'], recipes, new Map()).recipe_id, 3);
	const learned = new Map([[match.aliasKey('Chilaquiles', ['Pollo (130g)', 'Verde hoja santa']), 4]]);
	assert.equal(match.bestMatch('Chilaquiles', ['Verde hoja santa', 'Pollo (130g)'], recipes, learned).recipe_id, 4);
	assert.equal(match.bestMatch('Pizza', [], recipes, new Map()).recipe_id, null);
});
