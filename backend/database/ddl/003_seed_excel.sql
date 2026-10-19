-- =====================================================================
-- 003_seed_excel.sql
-- Generado por database/tools/excel_to_seed.py a partir de la plantilla
-- de costeo en Excel. Incluye ingredientes, recetas, detalle y precios.
-- =====================================================================

-- AVISO: Código repetido/vacío en 'Etiqueta impresa' -> ING103
-- AVISO: Código repetido/vacío en 'Servilleta' -> ING104
-- AVISO: Código repetido/vacío en 'Tenedor' -> ING105
-- AVISO: Código repetido/vacío en 'Cuchara' -> ING106
-- AVISO: Código repetido/vacío en 'Cuchillo' -> ING107
-- AVISO: Código repetido/vacío en 'Papel encerado' -> ING108
-- AVISO: Fila 111: componente vacío en Moon Milk 12oz frio, se omite

INSERT INTO ingredients (code, name, category, purchase_unit, purchase_cost) VALUES
	('ING001', 'orégano', 'insumo', 'pieza', 1.0),
	('ING002', 'manteca', 'insumo', 'kg', 70.0),
	('ING003', 'cilantro', 'insumo', 'pieza', 1.0),
	('ING004', 'queso Oaxaca', 'insumo', 'kg', 170.0),
	('ING005', 'frijoles refritos', 'insumo', 'kg', 60.0),
	('ING006', 'ajo', 'insumo', 'pieza', 2.0),
	('ING007', 'pimienta negra', 'insumo', 'kg', 883.0),
	('ING008', 'lechuga italiana', 'insumo', 'pieza', 2.0),
	('ING009', 'hierbabuena', 'insumo', 'kg', 400.0),
	('ING010', 'crema', 'insumo', 'L', 85.0),
	('ING011', 'huevo', 'insumo', 'pieza', 2.2),
	('ING012', 'cebolla morada', 'insumo', 'kg', 31.0),
	('ING013', 'queso rallado', 'insumo', 'kg', 48.0),
	('ING014', 'pepino', 'insumo', 'kg', 25.0),
	('ING016', 'sal', 'insumo', 'kg', 30.0),
	('ING017', 'mostaza', 'insumo', 'kg', 85.0),
	('ING018', 'tocino', 'insumo', 'kg', 116.0),
	('ING019', 'chile manzano', 'insumo', 'kg', 100.0),
	('ING020', 'chile habanero', 'insumo', 'kg', 120.0),
	('ING021', 'cebolla', 'insumo', 'kg', 42.0),
	('ING022', 'queso doble crema', 'insumo', 'kg', 152.0),
	('ING023', 'maicena', 'insumo', 'kg', 144.0),
	('ING024', 'caldo de pollo en polvo', 'insumo', 'kg', 227.27),
	('ING025', 'tomate', 'insumo', 'kg', 15.0),
	('ING026', 'hoja santa seca', 'insumo', 'pieza', 1.0),
	('ING027', 'aceite vegetal', 'insumo', 'L', 50.0),
	('ING028', 'jitomate', 'insumo', 'kg', 26.0),
	('ING029', 'tortillas de maíz', 'insumo', 'kg', 17.0),
	('ING030', 'totopos', 'insumo', 'kg', 100.0),
	('ING031', 'bolillo chico', 'insumo', 'pieza', 1.6),
	('ING032', 'mayonesa', 'insumo', 'kg', 117.0),
	('ING033', 'miel', 'insumo', 'kg', 100.0),
	('ING034', 'mantequilla', 'insumo', 'kg', 236.0),
	('ING035', 'jamón', 'insumo', 'kg', 264.0),
	('ING036', 'queso panela', 'insumo', 'kg', 263.0),
	('ING037', 'harina de trigo', 'insumo', 'kg', 26.0),
	('ING038', 'polvo para hornear', 'insumo', 'kg', 180.0),
	('ING039', 'leche entera', 'insumo', 'L', 32.0),
	('ING040', 'pan de caja para cruton', 'insumo', 'kg', 30.0),
	('ING041', 'queso manchego', 'insumo', 'kg', 182.0),
	('ING042', 'pan de caja para sandwich', 'insumo', 'pieza', 5.58),
	('ING043', 'atún lata', 'insumo', 'pieza', 25.0),
	('ING044', 'atún porción', 'insumo', 'pieza', 2.0),
	('ING045', 'mango', 'insumo', 'kg', 34.0),
	('ING046', 'platano', 'insumo', 'kg', 20.0),
	('ING047', 'manzana', 'insumo', 'kg', 54.0),
	('ING048', 'maple', 'insumo', 'kg', 125.0),
	('ING049', 'mermelada', 'insumo', 'kg', 148.0),
	('ING050', 'fresa', 'insumo', 'kg', 90.0),
	('ING051', 'limon', 'insumo', 'kg', 30.0),
	('ING052', 'menta', 'insumo', 'pieza', 10.0),
	('ING053', 'nuez', 'insumo', 'kg', 350.0),
	('ING054', 'almendra', 'insumo', 'kg', 120.0),
	('ING055', 'morita', 'insumo', 'kg', 120.0),
	('ING056', 'zanahoria', 'insumo', 'kg', 25.0),
	('ING057', 'crema para batir', 'insumo', 'kg', 123.0),
	('ING058', 'capsula N02 para sifon', 'insumo', 'pieza', 15.0),
	('ING059', 'vainilla', 'insumo', 'L', 89.0),
	('ING060', 'azucar', 'insumo', 'kg', 25.0),
	('ING061', 'agua', 'insumo', 'L', 3.25),
	('ING062', 'hielo/agua caliente', 'insumo', 'L', 8.0),
	('ING063', 'Cacao ABKKAO', 'insumo', 'kg', 410.0),
	('ING064', 'Te manzanilla', 'insumo', 'kg', 346.0),
	('ING065', 'Te negro', 'insumo', 'kg', 246.0),
	('ING066', 'Te verde', 'insumo', 'kg', 190.0),
	('ING067', 'Anis', 'insumo', 'kg', 358.0),
	('ING068', 'Piloncillo', 'insumo', 'kg', 67.0),
	('ING069', 'Leche en polvo', 'insumo', 'kg', 130.0),
	('ING070', 'canela', 'insumo', 'kg', 72.0),
	('ING071', 'cafe en grano', 'insumo', 'kg', 350.0),
	('ING078', 'Perlas explosivas', 'insumo', 'kg', 220.0),
	('ING079', 'Jarabe Vainilla Francesa', 'insumo', 'L', 170.0),
	('ING080', 'Jarabe Sabor Calabaza', 'insumo', 'L', 170.0),
	('ING081', 'Jarabe Caramelo', 'insumo', 'L', 170.0),
	('ING082', 'Base Neutra Frappé', 'insumo', 'kg', 220.0),
	('ING083', 'Base Cristal Frappes', 'insumo', 'kg', 220.0),
	('ING084', 'Jarabe fresa', 'insumo', 'L', 80.0),
	('ING085', 'Jarabe manzana verde', 'insumo', 'L', 80.0),
	('ING086', 'Jarabe mora', 'insumo', 'L', 90.0),
	('ING091', 'Jarabe de sabor generico', 'insumo', 'L', 90.0),
	('ING092', 'Agua gasificada', 'insumo', 'pieza', 10.0),
	('ING093', 'Hershey chocolate', 'insumo', 'kg', 136.0),
	('ING094', 'Hershey fresa', 'insumo', 'kg', 136.0),
	('ING095', 'ajo en polvo', 'insumo', 'kg', 597.4),
	('ING096', 'Aceite de oliva', 'insumo', 'L', 100.0),
	('ING097', 'Bicarbonato', 'insumo', 'kg', 40.0),
	('ING098', 'pollo cocido', 'insumo', 'kg', 80.0),
	('ING099', 'Croissant', 'insumo', 'pieza', 10.0),
	('ING100', 'Milanesa de res', 'insumo', 'kg', 230.0),
	('ING101', 'Bolillo', 'insumo', 'pieza', 3.0),
	('ING102', 'Vinagre de manzana', 'insumo', 'L', 25.0),
	('ING087', 'Vaso cafe 16Oz', 'empaque', 'pieza', 3.0),
	('ING088', 'Vaso cafe 12Oz', 'empaque', 'pieza', 3.0),
	('ING089', 'Portavasos 2 espacios', 'empaque', 'pieza', 0.5),
	('ING073', 'Popote booba', 'empaque', 'pieza', 1.2),
	('ING074', 'Press n seal', 'empaque', 'pieza', 1.0),
	('ING075', 'Vaso desechable boquilla 12oz', 'empaque', 'pieza', 3.0),
	('ING076', 'Vaso desechable domo 16oz', 'empaque', 'pieza', 3.0),
	('ING077', 'Bolsa grande', 'empaque', 'pieza', 1.0),
	('ING103', 'Etiqueta impresa', 'empaque', 'pieza', 1.0),
	('ING104', 'Servilleta', 'empaque', 'pieza', 1.0),
	('ING105', 'Tenedor', 'empaque', 'pieza', 1.0),
	('ING106', 'Cuchara', 'empaque', 'pieza', 1.0),
	('ING107', 'Cuchillo', 'empaque', 'pieza', 1.0),
	('ING090', 'Contenedor para alimentos', 'empaque', 'pieza', 6.0),
	('ING108', 'Papel encerado', 'empaque', 'pieza', 1.0);

INSERT INTO recipes (name, kind, category, yield_qty, yield_unit, notes) VALUES
	('Aderezo Limon Hierbabuena', 'preparacion', 'Preparaciones', 250.0, 'g', NULL),
	('Aderezo Limon oregano', 'preparacion', 'Preparaciones', 250.0, 'g', NULL),
	('Aderezo Miel mostaza', 'preparacion', 'Preparaciones', 300.0, 'g', NULL),
	('Cold brew Base', 'preparacion', 'Preparaciones', 900.0, 'g', NULL),
	('Crema batida', 'preparacion', 'Preparaciones', 500.0, 'g', NULL),
	('Crotones', 'preparacion', 'Preparaciones', 300.0, 'g', NULL),
	('espresso', 'preparacion', 'Preparaciones', 1.0, 'oz', NULL),
	('Hot cake', 'preparacion', 'Preparaciones', 3.0, 'pieza', NULL),
	('Jarabe de anis', 'preparacion', 'Preparaciones', 1200.0, 'g', NULL),
	('Jarabe de hierbabuena', 'preparacion', 'Preparaciones', 600.0, 'g', NULL),
	('Jarabe liquido', 'preparacion', 'Preparaciones', 1000.0, 'g', NULL),
	('Juego de limon', 'preparacion', 'Preparaciones', 15.0, 'g', NULL),
	('Masa tortilla harina', 'preparacion', 'Preparaciones', 863.0, 'g', NULL),
	('Mezcla humeda harina Hot cake', 'preparacion', 'Preparaciones', 283.0, 'g', NULL),
	('Mezcla seca harina Hot cake', 'preparacion', 'Preparaciones', 1000.0, 'g', NULL),
	('pico de gallo', 'preparacion', 'Preparaciones', 1000.0, 'g', NULL),
	('Salsa de chocolate', 'preparacion', 'Preparaciones', 400.0, 'g', NULL),
	('Salsa de queso-manzano', 'preparacion', 'Preparaciones', 1500.0, 'ml', NULL),
	('Salsa Roja Morita', 'preparacion', 'Preparaciones', 1500.0, 'ml', NULL),
	('Salsa verde hoja santa', 'preparacion', 'Preparaciones', 1500.0, 'ml', NULL),
	('Sincronizada base (3 piezas)', 'preparacion', 'Preparaciones', 3.0, 'pieza', 'Relleno y tortilla para 3 sincronizadas, sin empaque'),
	('Tortilla de harina', 'preparacion', 'Preparaciones', 1.0, 'pieza', NULL),
	('Cafe americano 12oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Cafe americano 16oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Cappuchino 12oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Cappuchino 16oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Chilaquiles queso carne', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles queso huevo', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles queso pollo', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles rojos carne', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles rojos huevo', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles rojos pollo', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles verdes carne', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles verdes huevo', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chilaquiles verdes pollo', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Chocolate 12oz caliente', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Chocolate 12oz frio', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Chocolate 16oz caliente', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Chocolate 16oz frio', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Cold brew 12oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Cold brew 16oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Cold brew Foam 12oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Cold brew Foam 16oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Croissant atun', 'producto_final', 'Sándwiches', 1.0, 'pieza', NULL),
	('Croissant Jamon y queso', 'producto_final', 'Sándwiches', 1.0, 'pieza', NULL),
	('Croissant pollo', 'producto_final', 'Sándwiches', 1.0, 'pieza', NULL),
	('Enchiladas queso', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Enchiladas rojas', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Enchiladas verdes', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Ensalada clasica atun', 'producto_final', 'Ensaladas', 1.0, 'pieza', NULL),
	('Ensalada clasica pollo', 'producto_final', 'Ensaladas', 1.0, 'pieza', NULL),
	('Ensalada clasica queso', 'producto_final', 'Ensaladas', 1.0, 'pieza', NULL),
	('Ensalada Kennedy', 'producto_final', 'Ensaladas', 1.0, 'pieza', NULL),
	('Especialidad - Aeropress 12oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Especialidad - Prensa Francesa 12oz', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Frappe con jarabe 16oz', 'producto_final', 'Bebidas frías', 1.0, 'pieza', NULL),
	('Frappuchino 16oz', 'producto_final', 'Bebidas frías', 1.0, 'pieza', NULL),
	('Frappuchino con Jarabe 16oz', 'producto_final', 'Bebidas frías', 1.0, 'pieza', NULL),
	('Infusion Te Manzanilla 12oz', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te Manzanilla 12oz helada', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te Manzanilla 16oz', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te Manzanilla 16oz helada', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te negro 12oz', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te negro 12oz helada', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te negro 16oz', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te negro 16oz helada', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te verde 12oz', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te verde 12oz helada', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te verde 16oz', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Infusion Te verde 16oz helada', 'producto_final', 'Té e infusiones', 1.0, 'pieza', NULL),
	('Latte 12oz caliente', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Latte 12oz frio', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Latte 16oz caliente', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('Latte 16oz frio', 'producto_final', 'Café', 1.0, 'pieza', NULL),
	('molletes', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('molletes de jamon', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('molletes de tocino', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Moon Milk 12oz Caliente', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Moon Milk 12oz Frio', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Moon Milk 16oz Caliente', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Moon Milk 16oz Frio', 'producto_final', 'Bebidas especiales', 1.0, 'pieza', NULL),
	('Orden de hot cakes', 'producto_final', 'Desayunos', 1.0, 'pieza', NULL),
	('Sandwich atun', 'producto_final', 'Sándwiches', 1.0, 'pieza', NULL),
	('Sandwich Jamon y queso', 'producto_final', 'Sándwiches', 1.0, 'pieza', NULL),
	('Sandwich pollo', 'producto_final', 'Sándwiches', 1.0, 'pieza', NULL),
	('Sincronizada extra (pieza)', 'producto_final', 'Desayunos', 1.0, 'pieza', 'Pieza adicional que se agrega a una orden (sin empaque)'),
	('Sincronizadas', 'producto_final', 'Desayunos', 1.0, 'pieza', 'Orden de 3 piezas con empaque'),
	('Slushi', 'producto_final', 'Bebidas frías', 1.0, 'pieza', NULL),
	('Soda Italiana', 'producto_final', 'Bebidas frías', 1.0, 'pieza', NULL);

-- Aderezo Limon Hierbabuena
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon Hierbabuena'), NULL, (SELECT id FROM recipes WHERE name = 'Juego de limon'), 50.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon Hierbabuena'), (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), NULL, 28.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon Hierbabuena'), (SELECT id FROM ingredients WHERE name = 'miel'), NULL, 25.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon Hierbabuena'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), 30.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon Hierbabuena'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 250.0, NULL, 4);
-- Aderezo Limon oregano
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon oregano'), NULL, (SELECT id FROM recipes WHERE name = 'Juego de limon'), 45.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon oregano'), (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), NULL, 80.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon oregano'), (SELECT id FROM ingredients WHERE name = 'orégano'), NULL, 2.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon oregano'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 2.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon oregano'), (SELECT id FROM ingredients WHERE name = 'pimienta negra'), NULL, 0.5, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Aderezo Limon oregano'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 250.0, NULL, 5);
-- Aderezo Miel mostaza
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'mostaza'), NULL, 60.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'miel'), NULL, 85.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), NULL, 50.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'Vinagre de manzana'), NULL, 15.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 2.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'pimienta negra'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), 10.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Aderezo Miel mostaza'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 100.0, NULL, 7);
-- Cold brew Base
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cold brew Base'), (SELECT id FROM ingredients WHERE name = 'cafe en grano'), NULL, 70.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cold brew Base'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 900.0, NULL, 1);
-- Crema batida
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Crema batida'), (SELECT id FROM ingredients WHERE name = 'crema para batir'), NULL, 400.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Crema batida'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe liquido'), 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Crema batida'), (SELECT id FROM ingredients WHERE name = 'vainilla'), NULL, 40.0, NULL, 2);
-- Crotones
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Crotones'), (SELECT id FROM ingredients WHERE name = 'pan de caja para cruton'), NULL, 300.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Crotones'), (SELECT id FROM ingredients WHERE name = 'ajo en polvo'), NULL, 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Crotones'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 2.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Crotones'), (SELECT id FROM ingredients WHERE name = 'pimienta negra'), NULL, 2.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Crotones'), (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), NULL, 30.0, NULL, 4);
-- espresso
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'espresso'), (SELECT id FROM ingredients WHERE name = 'cafe en grano'), NULL, 8.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'espresso'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 100.0, NULL, 1);
-- Hot cake
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Hot cake'), NULL, (SELECT id FROM recipes WHERE name = 'Mezcla humeda harina Hot cake'), 283.0, NULL, 0);
-- Jarabe de anis
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Jarabe de anis'), (SELECT id FROM ingredients WHERE name = 'Anis'), NULL, 24.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Jarabe de anis'), (SELECT id FROM ingredients WHERE name = 'Piloncillo'), NULL, 350.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Jarabe de anis'), (SELECT id FROM ingredients WHERE name = 'azucar'), NULL, 150.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Jarabe de anis'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 900.0, NULL, 3);
-- Jarabe de hierbabuena
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 430.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), (SELECT id FROM ingredients WHERE name = 'azucar'), NULL, 240.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), (SELECT id FROM ingredients WHERE name = 'hierbabuena'), NULL, 50.0, NULL, 2);
-- Jarabe liquido
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Jarabe liquido'), (SELECT id FROM ingredients WHERE name = 'azucar'), NULL, 500.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Jarabe liquido'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 500.0, NULL, 1);
-- Juego de limon
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Juego de limon'), (SELECT id FROM ingredients WHERE name = 'limon'), NULL, 40.0, NULL, 0);
-- Masa tortilla harina
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Masa tortilla harina'), (SELECT id FROM ingredients WHERE name = 'harina de trigo'), NULL, 500.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Masa tortilla harina'), (SELECT id FROM ingredients WHERE name = 'manteca'), NULL, 100.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Masa tortilla harina'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 7.5, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Masa tortilla harina'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 250.0, NULL, 3);
-- Mezcla humeda harina Hot cake
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Mezcla humeda harina Hot cake'), NULL, (SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), 125.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Mezcla humeda harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 134.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Mezcla humeda harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'aceite vegetal'), NULL, 12.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Mezcla humeda harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'vainilla'), NULL, 12.0, NULL, 3);
-- Mezcla seca harina Hot cake
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'harina de trigo'), NULL, 820.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'azucar'), NULL, 99.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 8.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'Bicarbonato'), NULL, 8.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'polvo para hornear'), NULL, 49.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Mezcla seca harina Hot cake'), (SELECT id FROM ingredients WHERE name = 'canela'), NULL, 17.0, NULL, 5);
-- pico de gallo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'pico de gallo'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 650.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'pico de gallo'), (SELECT id FROM ingredients WHERE name = 'cebolla'), NULL, 325.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'pico de gallo'), (SELECT id FROM ingredients WHERE name = 'chile habanero'), NULL, 25.0, NULL, 2);
-- Salsa de chocolate
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), (SELECT id FROM ingredients WHERE name = 'Cacao ABKKAO'), NULL, 35.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), (SELECT id FROM ingredients WHERE name = 'Leche en polvo'), NULL, 20.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), (SELECT id FROM ingredients WHERE name = 'maicena'), NULL, 2.5, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), (SELECT id FROM ingredients WHERE name = 'canela'), NULL, 7.5, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 250.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de anis'), 100.0, NULL, 5);
-- Salsa de queso-manzano
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'tocino'), NULL, 185.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'chile manzano'), NULL, 165.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'chile habanero'), NULL, 25.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'cebolla'), NULL, 65.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'ajo'), NULL, 5.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'queso doble crema'), NULL, 350.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 225.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'maicena'), NULL, 25.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'caldo de pollo en polvo'), NULL, 10.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 375.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 50.0, NULL, 10);
-- Salsa Roja Morita
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'morita'), NULL, 10.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'cebolla'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'chile habanero'), NULL, 9.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 600.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'ajo'), NULL, 3.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'caldo de pollo en polvo'), NULL, 7.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'azucar'), NULL, 2.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 500.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'aceite vegetal'), NULL, 50.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 50.0, NULL, 9);
-- Salsa verde hoja santa
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'tomate'), NULL, 640.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'chile habanero'), NULL, 20.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'cebolla'), NULL, 50.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'ajo'), NULL, 3.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 4.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'hoja santa seca'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'caldo de pollo en polvo'), NULL, 12.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 840.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), (SELECT id FROM ingredients WHERE name = 'sal'), NULL, 50.0, NULL, 8);
-- Sincronizada base (3 piezas)
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Sincronizada base (3 piezas)'), NULL, (SELECT id FROM recipes WHERE name = 'Tortilla de harina'), 3.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Sincronizada base (3 piezas)'), (SELECT id FROM ingredients WHERE name = 'jamón'), NULL, 60.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Sincronizada base (3 piezas)'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 72.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Sincronizada base (3 piezas)'), NULL, (SELECT id FROM recipes WHERE name = 'pico de gallo'), 40.0, NULL, 3);
-- Tortilla de harina
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Tortilla de harina'), NULL, (SELECT id FROM recipes WHERE name = 'Masa tortilla harina'), 50.0, NULL, 0);
-- Cafe americano 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 300.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Cafe americano 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 420.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cafe americano 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Cappuchino 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 240.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'canela'), NULL, 5.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8);
-- Cappuchino 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 360.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'canela'), NULL, 5.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Cappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8);
-- Chilaquiles queso carne
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Milanesa de res'), NULL, 130.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso carne'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Chilaquiles queso huevo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'huevo'), NULL, 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso huevo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Chilaquiles queso pollo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 130.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles queso pollo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Chilaquiles rojos carne
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Milanesa de res'), NULL, 130.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos carne'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Chilaquiles rojos huevo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'huevo'), NULL, 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos huevo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Chilaquiles rojos pollo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 130.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles rojos pollo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Chilaquiles verdes carne
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Milanesa de res'), NULL, 130.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes carne'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Chilaquiles verdes huevo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'huevo'), NULL, 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes huevo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Chilaquiles verdes pollo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'totopos'), NULL, 100.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 130.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), 200.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'bolillo chico'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Chilaquiles verdes pollo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Chocolate 12oz caliente
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), 60.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 270.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Chocolate 12oz frio
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 210.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 90.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chocolate 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Chocolate 16oz caliente
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 360.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), 90.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Chocolate 16oz frio
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de chocolate'), 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 270.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 120.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Chocolate 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Cold brew 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 180.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), NULL, (SELECT id FROM recipes WHERE name = 'Cold brew Base'), 180.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Cold brew 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8);
-- Cold brew 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 240.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'Cold brew Base'), 240.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Cold brew 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8);
-- Cold brew Foam 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), NULL, (SELECT id FROM recipes WHERE name = 'Crema batida'), 30.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Jarabe de sabor generico'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), NULL, (SELECT id FROM recipes WHERE name = 'Cold brew Base'), 150.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 150.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10);
-- Cold brew Foam 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'Crema batida'), 30.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Jarabe de sabor generico'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'Cold brew Base'), 210.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 210.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Cold brew Foam 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10);
-- Croissant atun
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Croissant'), NULL, 1.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'mayonesa'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'atún lata'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 24.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Croissant atun'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Croissant Jamon y queso
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Croissant'), NULL, 1.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'mayonesa'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'jamón'), NULL, 50.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 24.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Croissant Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Croissant pollo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Croissant'), NULL, 1.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'mayonesa'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 50.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 24.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Croissant pollo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Enchiladas queso
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'tortillas de maíz'), NULL, 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 60.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa de queso-manzano'), 100.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'aceite vegetal'), NULL, 50.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Enchiladas queso'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Enchiladas rojas
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'tortillas de maíz'), NULL, 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 60.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa Roja Morita'), 100.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 20.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 15.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'aceite vegetal'), NULL, 50.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Enchiladas rojas'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Enchiladas verdes
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'tortillas de maíz'), NULL, 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 60.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), NULL, (SELECT id FROM recipes WHERE name = 'Salsa verde hoja santa'), 100.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'crema'), NULL, 20.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'queso rallado'), NULL, 15.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'cebolla morada'), NULL, 3.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'cilantro'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'aceite vegetal'), NULL, 50.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 14),
	((SELECT id FROM recipes WHERE name = 'Enchiladas verdes'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 15);
-- Ensalada clasica atun
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 5.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'pepino'), NULL, 100.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'zanahoria'), NULL, 30.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), NULL, (SELECT id FROM recipes WHERE name = 'Crotones'), 25.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'atún lata'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica atun'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Ensalada clasica pollo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 5.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'pepino'), NULL, 100.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'zanahoria'), NULL, 30.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), NULL, (SELECT id FROM recipes WHERE name = 'Crotones'), 25.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 50.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica pollo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Ensalada clasica queso
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 5.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'pepino'), NULL, 100.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'zanahoria'), NULL, 30.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), NULL, (SELECT id FROM recipes WHERE name = 'Crotones'), 25.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'queso panela'), NULL, 50.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Ensalada clasica queso'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Ensalada Kennedy
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 5.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'zanahoria'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'manzana'), NULL, 50.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'mango'), NULL, 50.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'fresa'), NULL, 90.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), NULL, (SELECT id FROM recipes WHERE name = 'Crotones'), 25.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Ensalada Kennedy'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Especialidad - Aeropress 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'cafe en grano'), NULL, 20.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 400.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Aeropress 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Especialidad - Prensa Francesa 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'cafe en grano'), NULL, 20.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 400.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Especialidad - Prensa Francesa 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Frappe con jarabe 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Jarabe de sabor generico'), NULL, 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 150.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 240.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Base Cristal Frappes'), NULL, 20.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Hershey chocolate'), NULL, 10.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'Crema batida'), 30.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Frappe con jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 12);
-- Frappuchino 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 3.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 120.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 240.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Base Neutra Frappé'), NULL, 20.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Hershey chocolate'), NULL, 10.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'Crema batida'), 30.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Frappuchino 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 12);
-- Frappuchino con Jarabe 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Jarabe de sabor generico'), NULL, 60.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 120.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 240.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Base Neutra Frappé'), NULL, 20.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Hershey chocolate'), NULL, 10.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), NULL, (SELECT id FROM recipes WHERE name = 'Crema batida'), 30.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Frappuchino con Jarabe 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 13);
-- Infusion Te Manzanilla 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 355.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Te manzanilla'), NULL, 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Infusion Te Manzanilla 12oz helada
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 240.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Te manzanilla'), NULL, 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 120.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Infusion Te Manzanilla 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 480.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Te manzanilla'), NULL, 3.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Infusion Te Manzanilla 16oz helada
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 330.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Te manzanilla'), NULL, 3.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 150.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Infusion Te Manzanilla 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Infusion Te negro 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 355.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Te negro'), NULL, 4.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Infusion Te negro 12oz helada
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 240.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Te negro'), NULL, 4.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 120.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Infusion Te negro 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 480.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Te verde'), NULL, 5.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Infusion Te negro 16oz helada
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 330.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Te verde'), NULL, 5.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 150.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Infusion Te negro 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Infusion Te verde 12oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 355.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Te verde'), NULL, 3.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Infusion Te verde 12oz helada
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 240.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Te verde'), NULL, 3.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 120.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 12oz helada'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Infusion Te verde 16oz
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 480.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Te verde'), NULL, 4.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Infusion Te verde 16oz helada
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 330.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Te verde'), NULL, 4.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 150.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Infusion Te verde 16oz helada'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Latte 12oz caliente
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 270.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz caliente'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Latte 12oz frio
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 210.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 90.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Latte 12oz frio'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Latte 16oz caliente
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 390.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz caliente'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 7);
-- Latte 16oz frio
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 300.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), NULL, (SELECT id FROM recipes WHERE name = 'espresso'), 2.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 120.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Latte 16oz frio'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- molletes
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Bolillo'), NULL, 1.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'frijoles refritos'), NULL, 90.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'molletes'), NULL, (SELECT id FROM recipes WHERE name = 'pico de gallo'), 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'molletes'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 11);
-- molletes de jamon
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Bolillo'), NULL, 1.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'frijoles refritos'), NULL, 90.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), NULL, (SELECT id FROM recipes WHERE name = 'pico de gallo'), 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'jamón'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'molletes de jamon'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 12);
-- molletes de tocino
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Bolillo'), NULL, 1.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'frijoles refritos'), NULL, 90.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), NULL, (SELECT id FROM recipes WHERE name = 'pico de gallo'), 40.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'tocino'), NULL, 60.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'molletes de tocino'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 12);
-- Moon Milk 12oz Caliente
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de anis'), 30.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), 15.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 300.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 12Oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8);
-- Moon Milk 12oz Frio
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de anis'), 30.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), 15.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 210.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 90.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable boquilla 12oz'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 12oz Frio'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 9);
-- Moon Milk 16oz Caliente
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de anis'), 40.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), 20.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 390.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Vaso cafe 16Oz'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Caliente'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8);
-- Moon Milk 16oz Frio
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de anis'), 40.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), NULL, (SELECT id FROM recipes WHERE name = 'Jarabe de hierbabuena'), 20.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'leche entera'), NULL, 300.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 120.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Moon Milk 16oz Frio'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10);
-- Orden de hot cakes
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), NULL, (SELECT id FROM recipes WHERE name = 'Hot cake'), 3.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'maple'), NULL, 50.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'fresa'), NULL, 90.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Orden de hot cakes'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 10);
-- Sandwich atun
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'pan de caja para sandwich'), NULL, 2.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'mayonesa'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'atún lata'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 24.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Sandwich atun'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Sandwich Jamon y queso
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'pan de caja para sandwich'), NULL, 2.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'mayonesa'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'jamón'), NULL, 55.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 24.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Sandwich Jamon y queso'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Sandwich pollo
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'pan de caja para sandwich'), NULL, 2.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'mayonesa'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'pollo cocido'), NULL, 50.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'lechuga italiana'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'jitomate'), NULL, 40.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'queso manchego'), NULL, 24.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 10),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 11),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 12),
	((SELECT id FROM recipes WHERE name = 'Sandwich pollo'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 13);
-- Sincronizada extra (pieza)
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Sincronizada extra (pieza)'), NULL, (SELECT id FROM recipes WHERE name = 'Sincronizada base (3 piezas)'), 1.0, NULL, 0);
-- Sincronizadas
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), NULL, (SELECT id FROM recipes WHERE name = 'Sincronizada base (3 piezas)'), 3.0, 'Orden de 3 piezas', 0),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Contenedor para alimentos'), NULL, 1.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Papel encerado'), NULL, 1.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Tenedor'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Cuchillo'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Cuchara'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Sincronizadas'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 8);
-- Slushi
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Jarabe de sabor generico'), NULL, 90.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'agua'), NULL, 90.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 300.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Base Cristal Frappes'), NULL, 20.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Slushi'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10);
-- Soda Italiana
INSERT INTO recipe_items (recipe_id, ingredient_id, sub_recipe_id, quantity, notes, sort_order) VALUES
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Jarabe de sabor generico'), NULL, 50.0, NULL, 0),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Perlas explosivas'), NULL, 30.0, NULL, 1),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'hielo/agua caliente'), NULL, 150.0, NULL, 2),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Agua gasificada'), NULL, 1.0, NULL, 3),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Vaso desechable domo 16oz'), NULL, 1.0, NULL, 4),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Popote booba'), NULL, 1.0, NULL, 5),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Press n seal'), NULL, 1.0, NULL, 6),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Portavasos 2 espacios'), NULL, 1.0, NULL, 7),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Bolsa grande'), NULL, 1.0, NULL, 8),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Etiqueta impresa'), NULL, 1.0, NULL, 9),
	((SELECT id FROM recipes WHERE name = 'Soda Italiana'), (SELECT id FROM ingredients WHERE name = 'Servilleta'), NULL, 1.0, NULL, 10);

-- Precios: el Excel tenía un solo precio por producto; se copia a todos los canales.
INSERT INTO recipe_prices (recipe_id, channel_id, price)
SELECT r.id, c.id, p.price FROM (
	SELECT 'Moon Milk 12oz Caliente' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Moon Milk 16oz Caliente' AS name, 70.0 AS price
	UNION ALL
	SELECT 'Moon Milk 12oz Frio' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Moon Milk 16oz Frio' AS name, 70.0 AS price
	UNION ALL
	SELECT 'Cold brew 12oz' AS name, 50.0 AS price
	UNION ALL
	SELECT 'Cold brew 16oz' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Cold brew Foam 12oz' AS name, 65.0 AS price
	UNION ALL
	SELECT 'Cold brew Foam 16oz' AS name, 75.0 AS price
	UNION ALL
	SELECT 'Cafe americano 12oz' AS name, 50.0 AS price
	UNION ALL
	SELECT 'Cafe americano 16oz' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Latte 12oz caliente' AS name, 70.0 AS price
	UNION ALL
	SELECT 'Latte 16oz caliente' AS name, 80.0 AS price
	UNION ALL
	SELECT 'Latte 12oz frio' AS name, 70.0 AS price
	UNION ALL
	SELECT 'Latte 16oz frio' AS name, 80.0 AS price
	UNION ALL
	SELECT 'Cappuchino 12oz' AS name, 75.0 AS price
	UNION ALL
	SELECT 'Cappuchino 16oz' AS name, 75.0 AS price
	UNION ALL
	SELECT 'Ensalada Kennedy' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Ensalada clasica pollo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Ensalada clasica atun' AS name, 150.0 AS price
	UNION ALL
	SELECT 'Ensalada clasica queso' AS name, 120.0 AS price
	UNION ALL
	SELECT 'Enchiladas rojas' AS name, 100.0 AS price
	UNION ALL
	SELECT 'Enchiladas verdes' AS name, 100.0 AS price
	UNION ALL
	SELECT 'Enchiladas queso' AS name, 120.0 AS price
	UNION ALL
	SELECT 'molletes' AS name, 60.0 AS price
	UNION ALL
	SELECT 'molletes de jamon' AS name, 75.0 AS price
	UNION ALL
	SELECT 'molletes de tocino' AS name, 75.0 AS price
	UNION ALL
	SELECT 'Sandwich pollo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Sandwich atun' AS name, 150.0 AS price
	UNION ALL
	SELECT 'Sandwich Jamon y queso' AS name, 120.0 AS price
	UNION ALL
	SELECT 'Croissant pollo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Croissant atun' AS name, 150.0 AS price
	UNION ALL
	SELECT 'Croissant Jamon y queso' AS name, 120.0 AS price
	UNION ALL
	SELECT 'Chilaquiles rojos pollo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Chilaquiles verdes pollo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Chilaquiles queso pollo' AS name, 150.0 AS price
	UNION ALL
	SELECT 'Chilaquiles rojos carne' AS name, 160.0 AS price
	UNION ALL
	SELECT 'Chilaquiles verdes carne' AS name, 160.0 AS price
	UNION ALL
	SELECT 'Chilaquiles queso carne' AS name, 180.0 AS price
	UNION ALL
	SELECT 'Chilaquiles rojos huevo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Chilaquiles verdes huevo' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Chilaquiles queso huevo' AS name, 150.0 AS price
	UNION ALL
	SELECT 'Sincronizadas' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Orden de hot cakes' AS name, 100.0 AS price
	UNION ALL
	SELECT 'Slushi' AS name, 90.0 AS price
	UNION ALL
	SELECT 'Soda Italiana' AS name, 65.0 AS price
	UNION ALL
	SELECT 'Especialidad - Aeropress 12oz' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Especialidad - Prensa Francesa 12oz' AS name, 35.0 AS price
	UNION ALL
	SELECT 'Infusion Te verde 12oz' AS name, 40.0 AS price
	UNION ALL
	SELECT 'Infusion Te verde 12oz helada' AS name, 45.0 AS price
	UNION ALL
	SELECT 'Infusion Te verde 16oz' AS name, 50.0 AS price
	UNION ALL
	SELECT 'Infusion Te verde 16oz helada' AS name, 35.0 AS price
	UNION ALL
	SELECT 'Infusion Te negro 12oz' AS name, 40.0 AS price
	UNION ALL
	SELECT 'Infusion Te negro 12oz helada' AS name, 45.0 AS price
	UNION ALL
	SELECT 'Infusion Te negro 16oz' AS name, 50.0 AS price
	UNION ALL
	SELECT 'Infusion Te negro 16oz helada' AS name, 35.0 AS price
	UNION ALL
	SELECT 'Infusion Te Manzanilla 12oz' AS name, 40.0 AS price
	UNION ALL
	SELECT 'Infusion Te Manzanilla 12oz helada' AS name, 45.0 AS price
	UNION ALL
	SELECT 'Infusion Te Manzanilla 16oz' AS name, 50.0 AS price
	UNION ALL
	SELECT 'Infusion Te Manzanilla 16oz helada' AS name, 110.0 AS price
	UNION ALL
	SELECT 'Frappuchino 16oz' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Frappuchino con Jarabe 16oz' AS name, 130.0 AS price
	UNION ALL
	SELECT 'Frappe con jarabe 16oz' AS name, 120.0 AS price
	UNION ALL
	SELECT 'Chocolate 12oz caliente' AS name, 60.0 AS price
	UNION ALL
	SELECT 'Chocolate 16oz caliente' AS name, 70.0 AS price
	UNION ALL
	SELECT 'Chocolate 12oz frio' AS name, 65.0 AS price
	UNION ALL
	SELECT 'Chocolate 16oz frio' AS name, 75.0 AS price
	UNION ALL
	SELECT 'Sincronizada extra (pieza)' AS name, 20.0 AS price
) p
JOIN recipes r ON r.name = p.name
JOIN channels c ON c.code IN ('uber', 'didi', 'rappi', 'directo');
