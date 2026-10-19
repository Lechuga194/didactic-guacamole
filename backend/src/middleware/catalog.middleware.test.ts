import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { verifyBulkPrices, verifyRecipe } from './catalog.middleware';

/** Ejecuta el middleware con un body y devuelve si dejó pasar la petición y el error (si hubo). */
const run = (body: unknown, mw: RequestHandler = verifyRecipe): { passed: boolean; error?: unknown } => {
	let passed = false;
	let error: unknown;
	const res = {
		status: () => res,
		json: (payload: unknown) => {
			error = payload;
			return res;
		}
	} as unknown as Response;
	mw({ body } as Request, res, () => {
		passed = true;
	});
	return { passed, error };
};

const base = { name: 'Latte', kind: 'producto_final', yield_qty: 1, yield_unit: 'pieza' };

test('acepta componentes con el otro campo en null (como los manda la app)', () => {
	const r = run({
		...base,
		items: [
			{ ingredient_id: 3, sub_recipe_id: null, quantity: 270, notes: null },
			{ ingredient_id: null, sub_recipe_id: 7, quantity: 2, notes: null }
		]
	});
	assert.equal(r.passed, true, JSON.stringify(r.error));
});

test('rechaza un componente con ingrediente y preparación a la vez', () => {
	const r = run({ ...base, items: [{ ingredient_id: 3, sub_recipe_id: 7, quantity: 1 }] });
	assert.equal(r.passed, false);
});

test('rechaza un componente sin ingrediente ni preparación', () => {
	const r = run({ ...base, items: [{ ingredient_id: null, sub_recipe_id: null, quantity: 1 }] });
	assert.equal(r.passed, false);
});

test('guardado general de precios acepta precios y null (quitar precio)', () => {
	const changes = [
		{ recipe_id: 1, channel_id: 2, price: 95 },
		{ recipe_id: 1, channel_id: 3, price: null }
	];
	assert.equal(run({ changes }, verifyBulkPrices).passed, true);
	assert.equal(run({ changes: [] }, verifyBulkPrices).passed, false);
	assert.equal(run({ changes: [{ recipe_id: 1, channel_id: 2, price: -5 }] }, verifyBulkPrices).passed, false);
});
