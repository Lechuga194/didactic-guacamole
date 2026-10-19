-- =====================================================================
-- 007_sync_prices_from_didi.sql
-- DiDi es la fuente de verdad de precios. Precio de cada receta =
-- precio base del producto en DiDi + extra de la variante (proteína,
-- salsa, tamaño 16 oz, presentación fría, crema, sirope...).
-- Después se copian TODOS los precios del canal DiDi a Uber Eats y Rappi.
-- El trigger de recipe_prices deja el cambio en recipe_price_history.
-- =====================================================================

CREATE TEMP TABLE didi_price (recipe TEXT PRIMARY KEY, price REAL);

INSERT INTO didi_price (recipe, price) VALUES
	-- Café (Americano $50, Cappuccino $65, Latte $70, Cold brew $50, Aeropress $60, Prensa $60; 16 oz +$10, crema +$15)
	('Cafe americano 12oz', 50), ('Cafe americano 16oz', 60),
	('Cappuchino 12oz', 65), ('Cappuchino 16oz', 75),
	('Latte 12oz caliente', 70), ('Latte 12oz frio', 70), ('Latte 16oz caliente', 80), ('Latte 16oz frio', 80),
	('Cold brew 12oz', 50), ('Cold brew 16oz', 60), ('Cold brew Foam 12oz', 65), ('Cold brew Foam 16oz', 75),
	('Especialidad - Aeropress 12oz', 60), ('Especialidad - Prensa Francesa 12oz', 60),
	-- Menú de autor (Moon Light Milk $60)
	('Moon Milk 12oz Caliente', 60), ('Moon Milk 12oz Frio', 60), ('Moon Milk 16oz Caliente', 70), ('Moon Milk 16oz Frio', 70),
	-- Bebidas (Chocolate $60, Infusión $35 + fría $5, Frappuccino $110 + sirope $20, Frappé $130, Soda $90, Slushi $90)
	('Chocolate 12oz caliente', 60), ('Chocolate 12oz frio', 60), ('Chocolate 16oz caliente', 70), ('Chocolate 16oz frio', 70),
	('Infusion Te negro 12oz', 35), ('Infusion Te negro 12oz helada', 40), ('Infusion Te negro 16oz', 45), ('Infusion Te negro 16oz helada', 50),
	('Infusion Te verde 12oz', 35), ('Infusion Te verde 12oz helada', 40), ('Infusion Te verde 16oz', 45), ('Infusion Te verde 16oz helada', 50),
	('Infusion Te Manzanilla 12oz', 35), ('Infusion Te Manzanilla 12oz helada', 40), ('Infusion Te Manzanilla 16oz', 45), ('Infusion Te Manzanilla 16oz helada', 50),
	('Frappuchino 16oz', 110), ('Frappuchino con Jarabe 16oz', 130),
	('Frappe con jarabe 16oz', 130),
	('Soda Italiana', 90), ('Slushi', 90),
	-- Alimentos (Chilaquiles $130 + carne $30 + salsa de queso $20, Enchiladas $100, Molletes $60 + jamón/tocino $15,
	-- Sincronizadas $60, Hot Cakes $130, Sándwich/Cuernito $120 + pollo $10 / atún $20)
	('Chilaquiles verdes pollo', 130), ('Chilaquiles verdes huevo', 130), ('Chilaquiles verdes carne', 160),
	('Chilaquiles rojos pollo', 130), ('Chilaquiles rojos huevo', 130), ('Chilaquiles rojos carne', 160),
	('Chilaquiles queso pollo', 150), ('Chilaquiles queso huevo', 150), ('Chilaquiles queso carne', 180),
	('Enchiladas verdes', 100), ('Enchiladas rojas', 100), ('Enchiladas queso', 120),
	('molletes', 60), ('molletes de jamon', 75), ('molletes de tocino', 75),
	('Sincronizadas', 60),
	('Orden de hot cakes', 130),
	('Sandwich Jamon y queso', 120), ('Sandwich pollo', 130), ('Sandwich atun', 140),
	('Croissant Jamon y queso', 120), ('Croissant pollo', 130), ('Croissant atun', 140),
	-- Ensaladas (Clásica $130 + pollo $10 / atún $30, Kennedy $120 + proteína aparte)
	('Ensalada clasica queso', 130), ('Ensalada clasica pollo', 140), ('Ensalada clasica atun', 160),
	('Ensalada Kennedy', 120);

-- 1) Canal DiDi = precios reales de DiDi
INSERT INTO recipe_prices (recipe_id, channel_id, price)
SELECT r.id, ch.id, p.price
FROM didi_price p JOIN recipes r ON r.name = p.recipe JOIN channels ch ON ch.code = 'didi'
WHERE true
ON CONFLICT (recipe_id, channel_id) DO UPDATE SET price = excluded.price, updated_at = datetime('now', 'localtime');

-- 2) Uber Eats y Rappi = mismo precio que DiDi (todo lo que tenga precio en DiDi, combos incluidos)
INSERT INTO recipe_prices (recipe_id, channel_id, price)
SELECT d.recipe_id, ch.id, d.price
FROM recipe_prices d
JOIN channels dc ON dc.id = d.channel_id AND dc.code = 'didi'
JOIN channels ch ON ch.code IN ('uber', 'rappi')
WHERE true
ON CONFLICT (recipe_id, channel_id) DO UPDATE SET price = excluded.price, updated_at = datetime('now', 'localtime');

DROP TABLE didi_price;
