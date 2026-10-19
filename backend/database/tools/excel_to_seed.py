"""
Genera database/ddl/003_seed_excel.sql a partir de la plantilla de costeo en Excel.

Uso:
	python excel_to_seed.py <plantilla.xlsx> <salida.sql>

Correcciones aplicadas sobre los datos del Excel:
	- IDs de ingrediente duplicados se renumeran.
	- Nombres se limpian (espacios) y se resuelven sin distinguir mayúsculas.
	- Molletes: rendimiento 1 (un bolillo partido a la mitad = 1 orden).
	- Sincronizadas: se separa una preparación base de 3 piezas, la orden (3 piezas + empaque)
	  y una pieza extra sin empaque.
	- Filas de detalle vacías o con componentes inexistentes se omiten (se reportan).
"""

import re
import sys
import unicodedata

import openpyxl

PACKAGING_WORDS = (
	'vaso', 'portavasos', 'popote', 'press n seal', 'bolsa', 'etiqueta', 'servilleta', 'tenedor',
	'cuchara', 'cuchillo', 'contenedor', 'papel encerado'
)

CATEGORY_RULES = (
	(('moon milk', 'chocolate'), 'Bebidas especiales'),
	(('frapp', 'soda', 'slushi'), 'Bebidas frías'),
	(('infusion', ' te '), 'Té e infusiones'),
	(('cafe', 'latte', 'cappuchino', 'americano', 'espresso', 'aeropress', 'prensa', 'cold brew'), 'Café'),
	(('ensalada',), 'Ensaladas'),
	(('sandwich', 'croissant'), 'Sándwiches'),
	(('chilaquiles', 'enchiladas', 'molletes', 'sincronizada', 'hot cake'), 'Desayunos')
)

PRICE_CHANNELS = ('uber', 'didi', 'rappi', 'directo')


def norm(text):
	text = unicodedata.normalize('NFKD', str(text or '')).encode('ascii', 'ignore').decode()
	return re.sub(r'\s+', ' ', text).strip().lower()


def q(value):
	if value is None:
		return 'NULL'
	if isinstance(value, (int, float)):
		return repr(round(float(value), 6))
	return "'" + str(value).replace("'", "''") + "'"


def category_for(name, kind):
	if kind == 'preparacion':
		return 'Preparaciones'
	padded = ' ' + norm(name) + ' '
	for words, category in CATEGORY_RULES:
		if any(w in padded for w in words):
			return category
	return 'Otros'


def main(src, out):
	wb = openpyxl.load_workbook(src, data_only=True)
	warnings = []

	# ---------------- Ingredientes ----------------
	ws = wb['Ingredientes']
	ingredients = []
	used_codes = set()
	max_num = 0
	for r in range(2, ws.max_row + 1):
		name = ws.cell(r, 2).value
		if not name or not str(name).strip():
			continue
		code = str(ws.cell(r, 1).value or '').strip().split(' ')[0]
		m = re.match(r'ING(\d+)', code)
		if m:
			max_num = max(max_num, int(m.group(1)))
		ingredients.append({
			'code': code,
			'name': re.sub(r'\s+', ' ', str(name)).strip(),
			'unit': ws.cell(r, 3).value,
			'cost': float(ws.cell(r, 4).value or 0)
		})
	for ing in ingredients:
		if not ing['code'] or ing['code'] in used_codes:
			max_num += 1
			warnings.append(f"Código repetido/vacío en '{ing['name']}' -> ING{max_num:03d}")
			ing['code'] = f'ING{max_num:03d}'
		used_codes.add(ing['code'])
		n = norm(ing['name'])
		ing['category'] = 'empaque' if any(w in n for w in PACKAGING_WORDS) else 'insumo'
	ing_by_norm = {norm(i['name']): i['name'] for i in ingredients}

	# ---------------- Recetas ----------------
	ws = wb['Recetas']
	recipes = []
	for r in range(2, ws.max_row + 1):
		name = ws.cell(r, 1).value
		if not name or not str(name).strip():
			continue
		name = re.sub(r'\s+', ' ', str(name)).strip()
		kind = 'producto_final' if ws.cell(r, 2).value == 'Producto final' else 'preparacion'
		yield_qty = float(ws.cell(r, 3).value or 1)
		unit = str(ws.cell(r, 4).value or 'pieza').strip().lower()
		if norm(name).startswith('molletes'):
			yield_qty = 1
		recipes.append({'name': name, 'kind': kind, 'yield': yield_qty, 'unit': unit, 'notes': ws.cell(r, 7).value})
	rec_by_norm = {norm(x['name']): x['name'] for x in recipes}

	# ---------------- Detalle ----------------
	ws = wb['Recetas_Detalle']
	details = {}
	for r in range(2, ws.max_row + 1):
		rname, comp, qty = ws.cell(r, 1).value, ws.cell(r, 2).value, ws.cell(r, 4).value
		if not rname or not comp or not str(comp).strip():
			if rname and comp is not None:
				warnings.append(f'Fila {r}: componente vacío en {rname}, se omite')
			continue
		recipe = rec_by_norm.get(norm(rname))
		if not recipe:
			warnings.append(f'Fila {r}: receta desconocida {rname!r}')
			continue
		key = norm(comp)
		if key in ing_by_norm:
			item = ('ing', ing_by_norm[key])
		elif key in rec_by_norm:
			item = ('rec', rec_by_norm[key])
		else:
			warnings.append(f'Fila {r}: componente desconocido {comp!r} en {recipe}')
			continue
		details.setdefault(recipe, []).append((item[0], item[1], float(qty or 0), ws.cell(r, 8).value))

	# ---------------- Sincronizadas ----------------
	sinc = next((x for x in recipes if norm(x['name']) == 'sincronizadas'), None)
	if sinc:
		rows = details.get(sinc['name'], [])
		packaging = {i['name'] for i in ingredients if i['category'] == 'empaque'}
		food = [d for d in rows if not (d[0] == 'ing' and d[1] in packaging)]
		pack = [d for d in rows if d[0] == 'ing' and d[1] in packaging]
		base = 'Sincronizada base (3 piezas)'
		recipes.append({'name': base, 'kind': 'preparacion', 'yield': 3, 'unit': 'pieza',
						'notes': 'Relleno y tortilla para 3 sincronizadas, sin empaque'})
		details[base] = food
		details[sinc['name']] = [('rec', base, 3, 'Orden de 3 piezas')] + pack
		sinc['yield'] = 1
		sinc['notes'] = 'Orden de 3 piezas con empaque'
		extra = 'Sincronizada extra (pieza)'
		recipes.append({'name': extra, 'kind': 'producto_final', 'yield': 1, 'unit': 'pieza',
						'notes': 'Pieza adicional que se agrega a una orden (sin empaque)'})
		details[extra] = [('rec', base, 1, None)]

	# ---------------- Precios ----------------
	ws = wb['Venta']
	prices = {}
	for r in range(2, ws.max_row + 1):
		name, price = ws.cell(r, 1).value, ws.cell(r, 3).value
		if name and price is not None and norm(name) in rec_by_norm:
			prices[rec_by_norm[norm(name)]] = float(price)
	if sinc and sinc['name'] in prices:
		prices['Sincronizada extra (pieza)'] = round(prices[sinc['name']] / 3)

	# ---------------- Ordenar recetas para que las sub-recetas existan antes ----------------
	# (no es obligatorio por FK diferida, pero mantiene el archivo legible)
	recipes.sort(key=lambda x: (x['kind'] != 'preparacion', x['name'].lower()))

	lines = [
		'-- =====================================================================',
		'-- 003_seed_excel.sql',
		'-- Generado por database/tools/excel_to_seed.py a partir de la plantilla',
		'-- de costeo en Excel. Incluye ingredientes, recetas, detalle y precios.',
		'-- =====================================================================',
		''
	]
	for w in warnings:
		lines.append(f'-- AVISO: {w}')
	lines.append('')
	lines.append('INSERT INTO ingredients (code, name, category, purchase_unit, purchase_cost) VALUES')
	lines.append(',\n'.join(
		f"\t({q(i['code'])}, {q(i['name'])}, {q(i['category'])}, {q(i['unit'])}, {q(i['cost'])})" for i in ingredients
	) + ';')
	lines.append('')
	lines.append('INSERT INTO recipes (name, kind, category, yield_qty, yield_unit, notes) VALUES')
	lines.append(',\n'.join(
		f"\t({q(x['name'])}, {q(x['kind'])}, {q(category_for(x['name'], x['kind']))}, {q(x['yield'])}, {q(x['unit'])}, {q(x['notes'])})"
		for x in recipes
	) + ';')
	lines.append('')
	for x in recipes:
		rows = details.get(x['name'], [])
		if not rows:
			warnings.append(f"Receta sin componentes: {x['name']}")
			continue
		lines.append(f"-- {x['name']}")
		lines.append('INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES')
		values = []
		for idx, (kind, comp, qty, notes) in enumerate(rows):
			rid = f"(SELECT id FROM recipes WHERE name = {q(x['name'])})"
			if kind == 'ing':
				values.append(f"\t({rid}, (SELECT id FROM ingredients WHERE name = {q(comp)}), NULL, {q(qty)}, {q(notes)}, {idx})")
			else:
				values.append(f"\t({rid}, NULL, (SELECT id FROM recipes WHERE name = {q(comp)}), {q(qty)}, {q(notes)}, {idx})")
		lines.append(',\n'.join(values) + ';')
	lines.append('')
	lines.append('-- Precios: el Excel tenía un solo precio por producto; se copia a todos los canales.')
	lines.append('INSERT INTO recipe_prices (recipe_id, channel_id, price)')
	lines.append('SELECT r.id, c.id, p.price FROM (')
	lines.append('\n\tUNION ALL\n'.join(f'\tSELECT {q(n)} AS name, {q(p)} AS price' for n, p in prices.items()))
	lines.append(') p')
	lines.append('JOIN recipes r ON r.name = p.name')
	lines.append(f"JOIN channels c ON c.code IN ({', '.join(q(c) for c in PRICE_CHANNELS)});")
	lines.append('')

	with open(out, 'w', encoding='utf-8', newline='\n') as fh:
		fh.write('\n'.join(lines))
	print(f'{len(ingredients)} ingredientes, {len(recipes)} recetas, {len(prices)} precios')
	for w in warnings:
		print('AVISO:', w)


if __name__ == '__main__':
	main(sys.argv[1], sys.argv[2])
