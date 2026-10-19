import { test } from 'node:test';
import assert from 'node:assert/strict';
import pricing from './pricing.utils';
import cost from './cost.utils';

const uber = { commission_pct: 0.35, isr_ret_pct: 0.025, iva_ret_pct: 0.5 };
const directo = { commission_pct: 0, isr_ret_pct: 0, iva_ret_pct: 0 };

test('desglose de venta en Uber', () => {
	const b = pricing.breakdown(116, 30, uber, 0.16);
	assert.equal(pricing.round2(b.iva), 16);
	assert.equal(pricing.round2(b.commission), 40.6);
	assert.equal(pricing.round2(b.isr), 2.5);
	assert.equal(pricing.round2(b.iva_ret), 8);
	assert.equal(pricing.round2(b.profit), 116 - 16 - 40.6 - 2.5 - 30);
	assert.equal(pricing.round2(b.commission_iva), 6.5);
	assert.equal(pricing.round2(b.payout), pricing.round2(116 - 40.6 - 40.6 * 0.16 - 2.5 - 8));
});

test('coincide con la liquidación real de DiDi (pedido de $220 con $20 de promoción)', () => {
	// Liquidación semana 28/09-04/10: base de comisión 200, comisión 60, IVA de la aplicación 16%,
	// IVA retenido 13.77 sobre base 27.56, ISR retenido 4.29 sobre base 172.46
	const t = pricing.orderTotals(
		{ gross_amount: 220, discount_store: 20, discount_platform: 0, cost_amount: 0 },
		{ commission_pct: 0.3, isr_ret_pct: 0.025, iva_ret_pct: 0.5 },
		0.16
	);
	assert.equal(t.net_sale, 200);
	assert.equal(t.commission_amount, 60);
	assert.equal(t.commission_iva_amount, 9.6);
	assert.ok(Math.abs(t.iva_ret_amount - 13.77) <= 0.03);
	assert.ok(Math.abs(t.isr_ret_amount - 4.29) <= 0.03);
	// Depósito real: ganancia 140 - IVA app 9.60 - retenciones 18.06 = 112.34
	assert.ok(Math.abs(t.payout_amount - 112.34) <= 0.05);
});

test('el precio sugerido deja exactamente el margen objetivo', () => {
	const price = pricing.suggestedPrice(31.84, uber, 0.16, 0.25, 0) as number;
	const b = pricing.breakdown(price, 31.84, uber, 0.16);
	assert.ok(b.margin_pct >= 0.25 && b.margin_pct - 0.25 < 1e-3);
	const rounded = pricing.suggestedPrice(31.84, uber, 0.16, 0.25, 5) as number;
	assert.equal(rounded % 5, 0);
	assert.ok(rounded >= price);
});

test('sin precio posible cuando el canal se lleva todo', () => {
	assert.equal(pricing.suggestedPrice(10, { commission_pct: 0.8, isr_ret_pct: 0, iva_ret_pct: 0 }, 0.16, 0.25), null);
});

test('totales de pedido con descuento de tienda (ticket DiDi)', () => {
	const t = pricing.orderTotals(
		{ gross_amount: 180, discount_store: 30, discount_platform: 0, cost_amount: 60 },
		{ commission_pct: 0.3, isr_ret_pct: 0, iva_ret_pct: 0 },
		0.16
	);
	assert.equal(t.net_sale, 150);
	assert.equal(t.commission_amount, 45);
	assert.equal(t.payout_amount, 97.8);
});

test('venta directa sin comisión', () => {
	const t = pricing.orderTotals(
		{ gross_amount: 116, discount_store: 0, discount_platform: 0, cost_amount: 50 },
		directo,
		0.16
	);
	assert.equal(t.profit_amount, 50);
});

test('costo recursivo con sub-recetas y empaque', () => {
	const ingredients = [
		{ id: 1, unit_cost: 0.02, category: 'insumo' as const },
		{ id: 2, unit_cost: 6, category: 'empaque' as const }
	];
	const recipes = [
		{ id: 10, name: 'Salsa', yield_qty: 1000 },
		{ id: 11, name: 'Plato', yield_qty: 1 }
	];
	const items = [
		{ recipe_id: 10, ingredient_id: 1, sub_recipe_id: null, quantity: 1000 },
		{ recipe_id: 11, ingredient_id: null, sub_recipe_id: 10, quantity: 100 },
		{ recipe_id: 11, ingredient_id: 2, sub_recipe_id: null, quantity: 1 }
	];
	const costs = cost.computeRecipeCosts(recipes, items, ingredients);
	assert.equal(costs.get(10)?.unit, 0.02);
	assert.equal(pricing.round2(costs.get(11)?.unit || 0), 8);
	assert.equal(costs.get(11)?.packaging_unit, 6);
	assert.equal(cost.createsCycle(10, 11, items), true);
	assert.equal(cost.createsCycle(11, 10, items), false);
});
