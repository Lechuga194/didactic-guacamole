-- =====================================================================
-- 004_seed_didi_modifiers.sql
-- Grupos de modificadores de ALIMENTOS tal como están en el menú de
-- DiDi Food (Administrar menú > Grupos modificadores), con su precio
-- extra en pesos. Los grupos existentes se actualizan; las opciones que
-- ya no existen en DiDi se desactivan (no se borran, para conservar el
-- historial de ventas).
-- =====================================================================

CREATE TEMP TABLE didi_group (name TEXT PRIMARY KEY, defines_variant INTEGER, notes TEXT);
CREATE TEMP TABLE didi_option (grp TEXT, name TEXT, price REAL, active INTEGER);
CREATE TEMP TABLE didi_link (grp TEXT, pattern TEXT);

INSERT INTO didi_group (name, defines_variant, notes) VALUES
	('Proteina ensalada', 1, 'DiDi: obligatorio, elige 1'),
	('Aderezo Ensalada', 0, 'DiDi: opcional, 0 a 1'),
	('Toppings Ensalada', 0, 'DiDi: opcional, 0 a 1'),
	('Proteina Sándwich', 1, 'DiDi: obligatorio, elige 1'),
	('¿Deseas picante?', 0, 'DiDi: opcional, 0 a 1'),
	('Hot Cake Cubierta', 0, 'DiDi: opcional, 0 a 2'),
	('Hot Cake Topping', 0, 'DiDi: opcional, 0 a 1'),
	('Tipo de mollete', 1, 'DiDi: obligatorio, elige 1'),
	('¿Deseas pico de gallo?', 0, 'DiDi: obligatorio, elige 1'),
	('Terminación al gusto', 0, 'DiDi: opcional, 0 a 4'),
	('Proteina chilaquiles', 1, 'DiDi: obligatorio, elige 1'),
	('Salsa', 1, 'DiDi: obligatorio, elige 1'),
	('Bebida adicional', 0, 'DiDi: opcional, 0 a 10. Captura el costo de cada bebida en Modificadores'),
	('Hot Cake Adicionales', 0, 'DiDi: opcional, 0 a 10. Liga cada opción a su ingrediente para costearla');

INSERT INTO didi_option (grp, name, price, active) VALUES
	('Proteina ensalada', 'Queso panela', 0, 0),
	('Proteina ensalada', 'Pollo', 10, 1),
	('Proteina ensalada', 'Atún', 30, 1),
	('Aderezo Ensalada', 'Limón orégano', 0, 1),
	('Aderezo Ensalada', 'Miel mostaza', 0, 1),
	('Aderezo Ensalada', 'Limón hierbabuena', 0, 1),
	('Toppings Ensalada', 'Crotones (12g)', 0, 1),
	('Toppings Ensalada', 'Nuez Arandano (12g)', 0, 1),
	('Proteina Sándwich', 'Jamón rostizado', 0, 1),
	('Proteina Sándwich', 'Pollo', 10, 1),
	('Proteina Sándwich', 'Atún', 20, 1),
	('¿Deseas picante?', 'Jalapeño', 0, 1),
	('¿Deseas picante?', 'Chipotle', 0, 1),
	('¿Deseas picante?', 'Salsa macha', 0, 1),
	('Hot Cake Cubierta', 'Miel de maple', 0, 1),
	('Hot Cake Cubierta', 'Mantequilla derretida', 0, 1),
	('Hot Cake Cubierta', 'Cajeta', 0, 1),
	('Hot Cake Cubierta', 'Lechera', 0, 1),
	('Hot Cake Cubierta', 'Mermelada de Fresa y Jamaica', 0, 1),
	('Hot Cake Cubierta', 'Mermelada de Chabacano', 0, 1),
	('Hot Cake Cubierta', 'Mermelada de Zarzamora', 0, 1),
	('Hot Cake Topping', 'Platano', 0, 1),
	('Hot Cake Topping', 'Fresa', 0, 1),
	('Hot Cake Topping', 'Mango', 0, 1),
	('Tipo de mollete', 'Original', 0, 1),
	('Tipo de mollete', 'Jamón rostizado', 15, 1),
	('Tipo de mollete', 'Tocino', 15, 1),
	('¿Deseas pico de gallo?', 'Si', 0, 1),
	('¿Deseas pico de gallo?', 'No', 0, 1),
	('Terminación al gusto', 'Cebolla', 0, 1),
	('Terminación al gusto', 'Crema', 0, 1),
	('Terminación al gusto', 'Queso rayado', 0, 1),
	('Terminación al gusto', 'Cilantro', 0, 1),
	('Proteina chilaquiles', 'Huevos (2 pz)', 0, 1),
	('Proteina chilaquiles', 'Pollo (130g)', 0, 1),
	('Proteina chilaquiles', 'Carne de res (130g)', 30, 0),
	('Salsa', 'Verde hoja santa', 0, 1),
	('Salsa', 'Roja morita', 0, 1),
	('Salsa', 'Queso manzano', 20, 0),
	('Bebida adicional', 'Coca-Cola 600ml', 30, 1),
	('Bebida adicional', 'Coca-Cola Light 600ml', 30, 1),
	('Bebida adicional', 'Coca-Cola Zero 600ml', 30, 1),
	('Bebida adicional', 'Sidral Mundet 600ml', 30, 1),
	('Bebida adicional', 'Topo Chico 600ml', 30, 1),
	('Bebida adicional', 'Sangria Señorial 600ml', 30, 1),
	('Bebida adicional', 'Monster Zero Ultra', 50, 1),
	('Bebida adicional', 'Electrolit Sabores', 50, 1),
	('Bebida adicional', 'Jumex Sabores', 30, 1),
	('Bebida adicional', 'Del Valle Sabores', 30, 1),
	('Bebida adicional', 'Bonafont 600ml', 15, 1),
	('Hot Cake Adicionales', 'Miel de maple', 10, 1),
	('Hot Cake Adicionales', 'Mantequilla derretida', 10, 1),
	('Hot Cake Adicionales', 'Cajeta', 10, 1),
	('Hot Cake Adicionales', 'Lechera', 10, 1),
	('Hot Cake Adicionales', 'Mermelada de Fresa y Jamaica', 10, 1),
	('Hot Cake Adicionales', 'Mermelada de Chabacano', 10, 1),
	('Hot Cake Adicionales', 'Mermelada de Zarzamora', 10, 1);

-- Producto de DiDi -> recetas (producto final) que cubre
INSERT INTO didi_link (grp, pattern) VALUES
	('Proteina ensalada', 'Ensalada clasica%'), ('Proteina ensalada', 'Ensalada Kennedy'),
	('Aderezo Ensalada', 'Ensalada clasica%'), ('Aderezo Ensalada', 'Ensalada Kennedy'),
	('Toppings Ensalada', 'Ensalada clasica%'), ('Toppings Ensalada', 'Ensalada Kennedy'),
	('Proteina Sándwich', 'Sandwich%'), ('Proteina Sándwich', 'Croissant%'),
	('¿Deseas picante?', 'Sandwich%'), ('¿Deseas picante?', 'Croissant%'),
	('Hot Cake Cubierta', 'Orden de hot cakes'),
	('Hot Cake Topping', 'Orden de hot cakes'),
	('Hot Cake Adicionales', 'Orden de hot cakes'),
	('Tipo de mollete', 'molletes%'),
	('¿Deseas pico de gallo?', 'molletes%'), ('¿Deseas pico de gallo?', 'Sincronizadas'),
	('Terminación al gusto', 'Chilaquiles%'), ('Terminación al gusto', 'Enchiladas%'),
	('Proteina chilaquiles', 'Chilaquiles%'),
	('Salsa', 'Chilaquiles%'), ('Salsa', 'Enchiladas%'),
	('Bebida adicional', 'Orden de hot cakes'), ('Bebida adicional', 'Ensalada clasica%'),
	('Bebida adicional', 'Ensalada Kennedy'), ('Bebida adicional', 'Chilaquiles%'),
	('Bebida adicional', 'Enchiladas%'), ('Bebida adicional', 'molletes%'),
	('Bebida adicional', 'Sandwich%'), ('Bebida adicional', 'Croissant%'),
	('Bebida adicional', 'Sincronizadas');

-- Grupos: crear o actualizar
INSERT INTO modifier_groups (name, defines_variant, notes)
SELECT name, defines_variant, notes FROM didi_group WHERE true
ON CONFLICT (name) DO UPDATE SET defines_variant = excluded.defines_variant, notes = excluded.notes;

-- Opciones: crear o actualizar precio / estado
INSERT INTO modifier_options (group_id, name, price_delta, active)
SELECT g.id, o.name, o.price, o.active
FROM didi_option o JOIN modifier_groups g ON g.name = o.grp
WHERE true
ON CONFLICT (group_id, name) DO UPDATE SET price_delta = excluded.price_delta, active = excluded.active;

-- Opciones que ya no están en DiDi: se desactivan
UPDATE modifier_options SET active = 0
WHERE group_id IN (SELECT g.id FROM modifier_groups g JOIN didi_group d ON d.name = g.name)
  AND NOT EXISTS (
	SELECT 1 FROM didi_option o JOIN modifier_groups g ON g.name = o.grp
	WHERE g.id = modifier_options.group_id AND o.name = modifier_options.name COLLATE NOCASE
  );

-- Productos que muestran cada grupo
INSERT OR IGNORE INTO recipe_modifier_groups (recipe_id, group_id)
SELECT DISTINCT r.id, g.id
FROM didi_link l
JOIN modifier_groups g ON g.name = l.grp
JOIN recipes r ON r.name LIKE l.pattern AND r.kind = 'producto_final';

-- En DiDi el croissant se llama "Cuernito": alias para reconocerlo en los tickets
INSERT OR IGNORE INTO recipe_aliases (alias_key, recipe_id)
SELECT a.alias_key, r.id FROM (
	SELECT 'cuernito|pollo' AS alias_key, 'Croissant pollo' AS recipe UNION ALL
	SELECT 'cuernito|atun', 'Croissant atun' UNION ALL
	SELECT 'cuernito|jamon rostizado', 'Croissant Jamon y queso' UNION ALL
	SELECT 'sandwich|jamon rostizado', 'Sandwich Jamon y queso' UNION ALL
	SELECT 'ensalada clasica|queso panela', 'Ensalada clasica queso'
) a JOIN recipes r ON r.name = a.recipe;

DROP TABLE didi_group;
DROP TABLE didi_option;
DROP TABLE didi_link;
