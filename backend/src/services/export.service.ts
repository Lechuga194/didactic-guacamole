import ExcelJS from 'exceljs';
import { Knex } from 'knex';
import recipeService from './recipe.service';
import pricingService from './pricing.service';
import settingsService from './settings.service';
import orderService from './order.service';
import reportService from './report.service';

const MONEY = '"$"#,##0.00';
const PCT = '0.0%';

const sheet = (wb: ExcelJS.Workbook, name: string, columns: Partial<ExcelJS.Column>[]): ExcelJS.Worksheet => {
	const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
	ws.columns = columns;
	ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
	ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF37474F' } };
	return ws;
};

/** Libro con catálogo, precios por canal, pedidos y productos del periodo. */
export const buildWorkbook = async (db: Knex, from: string, to: string): Promise<Buffer> => {
	const wb = new ExcelJS.Workbook();
	wb.creator = 'Cocina App';
	const ctx = await recipeService.loadCostContext(db);
	const [channels, pricing, orders, stats] = await Promise.all([
		settingsService.listChannels(db, true),
		pricingService.pricingTable(db, ctx),
		orderService.listOrders(db, { from, to }, 100000),
		reportService.productStats(db, from, to)
	]);

	const ing = sheet(wb, 'Ingredientes', [
		{ header: 'Código', key: 'code', width: 10 },
		{ header: 'Ingrediente', key: 'name', width: 32 },
		{ header: 'Tipo', key: 'category', width: 10 },
		{ header: 'Unidad compra', key: 'purchase_unit', width: 14 },
		{ header: 'Costo compra', key: 'purchase_cost', width: 14, style: { numFmt: MONEY } },
		{ header: 'Unidad uso', key: 'use_unit', width: 12 },
		{ header: 'Costo por unidad de uso', key: 'unit_cost', width: 22, style: { numFmt: '"$"#,##0.0000' } }
	]);
	ctx.ingredients.sort((a, b) => a.name.localeCompare(b.name, 'es')).forEach((i) => ing.addRow(i));

	const rec = sheet(wb, 'Recetas', [
		{ header: 'Receta', key: 'name', width: 36 },
		{ header: 'Tipo', key: 'kind', width: 16 },
		{ header: 'Categoría', key: 'category', width: 18 },
		{ header: 'Rendimiento', key: 'yield_qty', width: 12 },
		{ header: 'Unidad', key: 'yield_unit', width: 8 },
		{ header: 'Costo total', key: 'total', width: 14, style: { numFmt: MONEY } },
		{ header: 'Costo unitario', key: 'unit', width: 14, style: { numFmt: '"$"#,##0.0000' } },
		{ header: 'Empaque unitario', key: 'packaging', width: 16, style: { numFmt: MONEY } }
	]);
	for (const r of [...ctx.recipes].sort((a, b) => a.name.localeCompare(b.name, 'es'))) {
		const c = recipeService.costOf(ctx, r.id);
		rec.addRow({ ...r, total: c.total, unit: c.unit, packaging: c.packaging_unit });
	}

	const priceCols: Partial<ExcelJS.Column>[] = [
		{ header: 'Producto', key: 'name', width: 36 },
		{ header: 'Categoría', key: 'category', width: 18 },
		{ header: 'Costo', key: 'cost', width: 12, style: { numFmt: MONEY } }
	];
	for (const ch of channels) {
		priceCols.push(
			{ header: `${ch.name} precio`, key: `p${ch.id}`, width: 14, style: { numFmt: MONEY } },
			{ header: `${ch.name} utilidad`, key: `u${ch.id}`, width: 14, style: { numFmt: MONEY } },
			{ header: `${ch.name} margen`, key: `m${ch.id}`, width: 12, style: { numFmt: PCT } },
			{ header: `${ch.name} sugerido`, key: `s${ch.id}`, width: 14, style: { numFmt: MONEY } }
		);
	}
	const pr = sheet(wb, 'Precios', priceCols);
	for (const row of pricing) {
		const data: Record<string, unknown> = { name: row.name, category: row.category, cost: row.cost_unit };
		for (const c of row.channels) {
			data[`p${c.channel_id}`] = c.price;
			data[`u${c.channel_id}`] = c.profit;
			data[`m${c.channel_id}`] = c.margin_pct;
			data[`s${c.channel_id}`] = c.suggested_price;
		}
		pr.addRow(data);
	}

	const ord = sheet(wb, 'Pedidos', [
		{ header: 'Fecha', key: 'ordered_at', width: 17 },
		{ header: 'Canal', key: 'channel_name', width: 14 },
		{ header: 'Folio', key: 'external_ref', width: 22 },
		{ header: 'Estado', key: 'status', width: 12 },
		{ header: 'Productos', key: 'items_summary', width: 50 },
		{ header: 'Venta bruta', key: 'gross_amount', width: 12, style: { numFmt: MONEY } },
		{ header: 'Desc. tienda', key: 'discount_store', width: 12, style: { numFmt: MONEY } },
		{ header: 'Venta neta', key: 'net_sale', width: 12, style: { numFmt: MONEY } },
		{ header: 'IVA', key: 'iva_amount', width: 10, style: { numFmt: MONEY } },
		{ header: 'Comisión', key: 'commission_amount', width: 12, style: { numFmt: MONEY } },
		{ header: 'IVA comisión', key: 'commission_iva_amount', width: 12, style: { numFmt: MONEY } },
		{ header: 'ISR ret.', key: 'isr_ret_amount', width: 10, style: { numFmt: MONEY } },
		{ header: 'IVA ret.', key: 'iva_ret_amount', width: 10, style: { numFmt: MONEY } },
		{ header: 'Costo', key: 'cost_amount', width: 12, style: { numFmt: MONEY } },
		{ header: 'Utilidad', key: 'profit_amount', width: 12, style: { numFmt: MONEY } },
		{ header: 'Depósito esperado', key: 'payout_amount', width: 16, style: { numFmt: MONEY } }
	]);
	orders.forEach((o) => ord.addRow(o));

	const prod = sheet(wb, 'Productos vendidos', [
		{ header: 'Producto', key: 'name', width: 36 },
		{ header: 'Categoría', key: 'category', width: 18 },
		{ header: 'Unidades', key: 'units', width: 10 },
		{ header: 'Venta neta', key: 'sales', width: 14, style: { numFmt: MONEY } },
		{ header: 'Costo', key: 'cost', width: 12, style: { numFmt: MONEY } },
		{ header: 'Utilidad', key: 'profit', width: 12, style: { numFmt: MONEY } },
		{ header: 'Margen', key: 'margin_pct', width: 10, style: { numFmt: PCT } }
	]);
	stats.sort((a, b) => b.units - a.units).forEach((s) => prod.addRow(s));

	return Buffer.from(await wb.xlsx.writeBuffer());
};

export default { buildWorkbook };
