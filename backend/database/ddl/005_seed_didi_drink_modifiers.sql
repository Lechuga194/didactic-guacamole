-- =====================================================================
-- 005_seed_didi_drink_modifiers.sql
-- Grupos de modificadores de BEBIDAS tal como están en DiDi Food, con su
-- precio extra, ligados a las recetas de bebidas, y alias para reconocer
-- en los tickets la combinación producto + variante (tamaño, temperatura,
-- sabor, presentación) como la receta correcta.
-- Generado por un script a partir del portal de tienda de DiDi.
-- =====================================================================

CREATE TEMP TABLE didi_group (name TEXT PRIMARY KEY, defines_variant INTEGER, notes TEXT);
CREATE TEMP TABLE didi_option (grp TEXT, name TEXT, price REAL, active INTEGER);
CREATE TEMP TABLE didi_link (grp TEXT, pattern TEXT);

INSERT INTO didi_group (name, defines_variant, notes) VALUES
	('Tipo de leche', 0, 'DiDi: obligatorio, elige 1'),
	('Endulzantes', 0, 'DiDi: obligatorio, elige 1'),
	('Sabores', 1, 'DiDi: obligatorio, elige 1 (define la infusión)'),
	('Presentación de la infusión', 1, 'DiDi: obligatorio, elige 1 (fría = helada)'),
	('Sirope de especialidad', 0, 'DiDi: obligatorio, elige 1'),
	('Nube de crema', 0, 'DiDi: obligatorio, elige 1'),
	('Veteado', 0, 'DiDi: obligatorio, elige 1'),
	('Base frutal', 0, 'DiDi: obligatorio, elige 1'),
	('¿Deseas crema?', 1, 'DiDi: opcional. Con crema = Cold brew Foam'),
	('Aumenta el tamaño', 1, 'DiDi: opcional. 16 oz = receta de 16oz'),
	('Temperatura', 1, 'DiDi: obligatorio, elige 1'),
	('¿Deseas canela?', 0, 'DiDi: opcional, 0 a 1'),
	('Sirope para tu frappe', 0, 'DiDi: obligatorio, elige 1');

INSERT INTO didi_option (grp, name, price, active) VALUES
	('Tipo de leche', 'Entera', 0, 1),
	('Tipo de leche', 'Deslactosada', 5, 1),
	('Endulzantes', 'Sin endulzantes', 0, 1),
	('Endulzantes', 'Azucar de caña', 0, 1),
	('Endulzantes', 'Stevia', 0, 1),
	('Sabores', 'Té negro', 0, 1),
	('Sabores', 'Té verde', 0, 1),
	('Sabores', 'Manzanilla', 0, 1),
	('Presentación de la infusión', 'Caliente', 0, 1),
	('Presentación de la infusión', 'Fria', 5, 1),
	('Sirope de especialidad', 'Original', 0, 1),
	('Sirope de especialidad', 'Chocolate artesanal', 20, 1),
	('Sirope de especialidad', 'Pumpkin spice', 20, 1),
	('Sirope de especialidad', 'Vainilla francesa', 20, 1),
	('Sirope de especialidad', 'Caramelo', 20, 1),
	('Nube de crema', 'Si', 0, 1),
	('Nube de crema', 'No', 0, 1),
	('Veteado', 'Sin veteado', 0, 1),
	('Veteado', 'Chocolate', 0, 1),
	('Veteado', 'Fresa', 0, 1),
	('Base frutal', 'Manzana verde', 0, 1),
	('Base frutal', 'Mora azul', 0, 1),
	('Base frutal', 'Fresa', 0, 1),
	('¿Deseas crema?', 'Si', 15, 1),
	('Aumenta el tamaño', '16 oz (473 ml)', 10, 1),
	('Temperatura', 'Caliente', 0, 1),
	('Temperatura', 'Frio', 0, 1),
	('¿Deseas canela?', 'Canela', 0, 1),
	('Sirope para tu frappe', 'Chocolate artesanal', 0, 1),
	('Sirope para tu frappe', 'Pumpkin spice', 0, 1),
	('Sirope para tu frappe', 'Vainilla francesa', 0, 1),
	('Sirope para tu frappe', 'Caramelo', 0, 1);

INSERT INTO didi_link (grp, pattern) VALUES
	('Tipo de leche', 'Frappe%'),
	('Tipo de leche', 'Chocolate%'),
	('Tipo de leche', 'Frappuchino%'),
	('Tipo de leche', 'Moon Milk%'),
	('Tipo de leche', 'Latte%'),
	('Tipo de leche', 'Cappuchino%'),
	('Endulzantes', 'Infusion%'),
	('Endulzantes', 'Frappuchino%'),
	('Endulzantes', 'Moon Milk%'),
	('Endulzantes', 'Cafe americano%'),
	('Endulzantes', 'Especialidad%'),
	('Endulzantes', 'Latte%'),
	('Endulzantes', 'Cappuchino%'),
	('Endulzantes', 'Cold brew%'),
	('Sabores', 'Infusion%'),
	('Presentación de la infusión', 'Infusion%'),
	('Sirope de especialidad', 'Frappuchino%'),
	('Sirope de especialidad', 'Latte%'),
	('Nube de crema', 'Frappe%'),
	('Nube de crema', 'Frappuchino%'),
	('Veteado', 'Frappe%'),
	('Veteado', 'Frappuchino%'),
	('Base frutal', 'Soda Italiana'),
	('Base frutal', 'Slushi'),
	('¿Deseas crema?', 'Cold brew%'),
	('Aumenta el tamaño', 'Chocolate%'),
	('Aumenta el tamaño', 'Cold brew%'),
	('Aumenta el tamaño', 'Infusion%'),
	('Aumenta el tamaño', 'Moon Milk%'),
	('Aumenta el tamaño', 'Cappuchino%'),
	('Aumenta el tamaño', 'Latte%'),
	('Aumenta el tamaño', 'Cafe americano%'),
	('Temperatura', 'Moon Milk%'),
	('Temperatura', 'Latte%'),
	('¿Deseas canela?', 'Frappe%'),
	('¿Deseas canela?', 'Cappuchino%'),
	('Sirope para tu frappe', 'Frappe%');

INSERT INTO modifier_groups (name, defines_variant, notes)
SELECT name, defines_variant, notes FROM didi_group WHERE true
ON CONFLICT (name) DO UPDATE SET defines_variant = excluded.defines_variant, notes = excluded.notes;

INSERT INTO modifier_options (group_id, name, price_delta, active)
SELECT g.id, o.name, o.price, o.active
FROM didi_option o JOIN modifier_groups g ON g.name = o.grp
WHERE true
ON CONFLICT (group_id, name) DO UPDATE SET price_delta = excluded.price_delta, active = excluded.active;

-- Opciones que ya no están en DiDi: se desactivan (p. ej. "Azúcar" -> "Azucar de caña")
UPDATE modifier_options SET active = 0
WHERE group_id IN (SELECT g.id FROM modifier_groups g JOIN didi_group d ON d.name = g.name)
  AND NOT EXISTS (
	SELECT 1 FROM didi_option o JOIN modifier_groups g ON g.name = o.grp
	WHERE g.id = modifier_options.group_id AND o.name = modifier_options.name COLLATE NOCASE
  );

INSERT OR IGNORE INTO recipe_modifier_groups (recipe_id, group_id)
SELECT DISTINCT r.id, g.id
FROM didi_link l
JOIN modifier_groups g ON g.name = l.grp
JOIN recipes r ON r.name LIKE l.pattern AND r.kind = 'producto_final';

-- Producto de DiDi + variante -> receta
INSERT OR REPLACE INTO recipe_aliases (alias_key, recipe_id)
SELECT a.alias_key, r.id FROM (
	SELECT 'infusion|caliente|te negro' AS alias_key, 'Infusion Te negro 12oz' AS recipe
	UNION ALL SELECT 'infusion|fria|te negro', 'Infusion Te negro 12oz helada'
	UNION ALL SELECT 'infusion|caliente|te verde', 'Infusion Te verde 12oz'
	UNION ALL SELECT 'infusion|fria|te verde', 'Infusion Te verde 12oz helada'
	UNION ALL SELECT 'infusion|caliente|manzanilla', 'Infusion Te Manzanilla 12oz'
	UNION ALL SELECT 'infusion|fria|manzanilla', 'Infusion Te Manzanilla 12oz helada'
	UNION ALL SELECT 'latte|caliente', 'Latte 12oz caliente'
	UNION ALL SELECT 'moon light milk|caliente', 'Moon Milk 12oz caliente'
	UNION ALL SELECT 'latte|frio', 'Latte 12oz frio'
	UNION ALL SELECT 'moon light milk|frio', 'Moon Milk 12oz frio'
	UNION ALL SELECT 'americano', 'Cafe americano 12oz'
	UNION ALL SELECT 'cappuccino', 'Cappuchino 12oz'
	UNION ALL SELECT 'chocolate', 'Chocolate 12oz caliente'
	UNION ALL SELECT 'cold brew', 'Cold brew 12oz'
	UNION ALL SELECT 'cold brew|si', 'Cold brew Foam 12oz'
	UNION ALL SELECT 'infusion|16 oz 473 ml|caliente|te negro', 'Infusion Te negro 16oz'
	UNION ALL SELECT 'infusion|16 oz 473 ml|fria|te negro', 'Infusion Te negro 16oz helada'
	UNION ALL SELECT 'infusion|16 oz 473 ml|caliente|te verde', 'Infusion Te verde 16oz'
	UNION ALL SELECT 'infusion|16 oz 473 ml|fria|te verde', 'Infusion Te verde 16oz helada'
	UNION ALL SELECT 'infusion|16 oz 473 ml|caliente|manzanilla', 'Infusion Te Manzanilla 16oz'
	UNION ALL SELECT 'infusion|16 oz 473 ml|fria|manzanilla', 'Infusion Te Manzanilla 16oz helada'
	UNION ALL SELECT 'latte|16 oz 473 ml|caliente', 'Latte 16oz caliente'
	UNION ALL SELECT 'moon light milk|16 oz 473 ml|caliente', 'Moon Milk 16oz caliente'
	UNION ALL SELECT 'latte|16 oz 473 ml|frio', 'Latte 16oz frio'
	UNION ALL SELECT 'moon light milk|16 oz 473 ml|frio', 'Moon Milk 16oz frio'
	UNION ALL SELECT 'americano|16 oz 473 ml', 'Cafe americano 16oz'
	UNION ALL SELECT 'cappuccino|16 oz 473 ml', 'Cappuchino 16oz'
	UNION ALL SELECT 'chocolate|16 oz 473 ml', 'Chocolate 16oz caliente'
	UNION ALL SELECT 'cold brew|16 oz 473 ml', 'Cold brew 16oz'
	UNION ALL SELECT 'cold brew|16 oz 473 ml|si', 'Cold brew Foam 16oz'
	UNION ALL SELECT 'frappuccino', 'Frappuchino 16oz'
	UNION ALL SELECT 'frappe', 'Frappe con jarabe 16oz'
	UNION ALL SELECT 'prensa francesa', 'Especialidad - Prensa Francesa 12oz'
	UNION ALL SELECT 'aeropress', 'Especialidad - Aeropress 12oz'
) a JOIN recipes r ON r.name = a.recipe;

DROP TABLE didi_group;
DROP TABLE didi_option;
DROP TABLE didi_link;
