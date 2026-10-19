-- =====================================================================
-- 006_seed_didi_combos.sql
-- Combos publicados en DiDi Food (Administrar menú > Descripción general)
-- con su precio de entrega. Cada combo lleva la receta de referencia de
-- cada producto incluido para estimar su costo; al registrar una venta
-- se eligen los productos reales (sabor, proteína, tamaño...).
-- =====================================================================

CREATE TEMP TABLE didi_combo (name TEXT PRIMARY KEY, price REAL, notes TEXT);
CREATE TEMP TABLE didi_combo_item (combo TEXT, recipe TEXT, quantity REAL, sort_order INTEGER);

INSERT INTO didi_combo (name, price, notes) VALUES
	('Combo Desayuno', 180, 'DiDi: Chilaquiles + Americano'),
	('Combo Molletes', 125, 'DiDi: Molletes + Cappuccino'),
	('Combo Sincronizadas', 125, 'DiDi: Sincronizadas + Cappuccino'),
	('Combo Frappe Amigos', 260, 'DiDi: 2 Frappés'),
	('Combo Frapuccino Amigos', 220, 'DiDi: 2 Frappuccinos'),
	('Combo Ensalada', 165, 'DiDi: Ensalada Clásica + Infusión');

INSERT INTO didi_combo_item (combo, recipe, quantity, sort_order) VALUES
	('Combo Desayuno', 'Chilaquiles verdes pollo', 1, 0),
	('Combo Desayuno', 'Cafe americano 12oz', 1, 1),
	('Combo Molletes', 'molletes', 1, 0),
	('Combo Molletes', 'Cappuchino 12oz', 1, 1),
	('Combo Sincronizadas', 'Sincronizadas', 1, 0),
	('Combo Sincronizadas', 'Cappuchino 12oz', 1, 1),
	('Combo Frappe Amigos', 'Frappe con jarabe 16oz', 2, 0),
	('Combo Frapuccino Amigos', 'Frappuchino 16oz', 2, 0),
	('Combo Ensalada', 'Ensalada clasica pollo', 1, 0),
	('Combo Ensalada', 'Infusion Te verde 12oz', 1, 1);

-- Recetas tipo combo (crear o actualizar)
INSERT INTO recipes (name, kind, category, yield_qty, yield_unit, notes)
SELECT name, 'combo', 'Combos', 1, 'pieza', notes FROM didi_combo WHERE true
ON CONFLICT (name) DO UPDATE SET kind = 'combo', category = 'Combos', notes = excluded.notes;

-- Composición de referencia
DELETE FROM recipe_items WHERE recipe_id IN (SELECT r.id FROM recipes r JOIN didi_combo c ON c.name = r.name);
INSERT INTO recipe_items (recipe_id, sub_recipe_id, quantity, sort_order)
SELECT c.id, s.id, i.quantity, i.sort_order
FROM didi_combo_item i
JOIN recipes c ON c.name = i.combo
JOIN recipes s ON s.name = i.recipe;

-- Precio en el canal DiDi
INSERT INTO recipe_prices (recipe_id, channel_id, price)
SELECT r.id, ch.id, c.price
FROM didi_combo c JOIN recipes r ON r.name = c.name JOIN channels ch ON ch.code = 'didi'
WHERE true
ON CONFLICT (recipe_id, channel_id) DO UPDATE SET price = excluded.price;

DROP TABLE didi_combo;
DROP TABLE didi_combo_item;
