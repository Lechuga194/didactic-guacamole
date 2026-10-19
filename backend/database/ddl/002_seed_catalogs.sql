-- =====================================================================
-- 002_seed_catalogs.sql
-- Parámetros iniciales, canales de venta y modificadores observados en
-- los tickets de DiDi / Uber. Todo es editable desde la app.
-- =====================================================================

INSERT INTO settings (key, value, description) VALUES
	('iva_rate', '0.16', 'Tasa de IVA (precios con IVA incluido)'),
	('target_margin_pct', '0.25', 'Margen de utilidad neta objetivo sobre el precio de venta'),
	('food_cost_target_pct', '0.30', 'Food cost objetivo (costo / precio)'),
	('price_rounding', '5', 'Redondeo hacia arriba del precio sugerido (pesos)'),
	('daily_sales_goal', '0', 'Meta diaria de venta neta (0 = sin meta)'),
	('daily_profit_goal', '0', 'Meta diaria de utilidad (0 = sin meta)'),
	('backup_keep', '30', 'Número de respaldos automáticos a conservar'),
	('business_name', 'Mi Dark Kitchen', 'Nombre que se muestra en la app');

-- Régimen de plataformas digitales (art. 113-A LISR):
--   ISR retenido sobre la base sin IVA (2.5% desde la reforma 2026 - confirmar con contador)
--   IVA retenido: 50% del IVA trasladado
-- Colores: paleta categórica validada (daltonismo) en este orden de canales.
INSERT INTO channels (code, name, commission_pct, isr_ret_pct, iva_ret_pct, target_margin_pct, is_platform, color, sort_order) VALUES
	('uber', 'Uber Eats', 0.35, 0.025, 0.50, NULL, 1, '#1baf7a', 1),
	('didi', 'DiDi Food', 0.30, 0.025, 0.50, NULL, 1, '#eb6834', 2),
	('directo', 'Venta directa', 0.00, 0.025, 0.00, NULL, 0, '#2a78d6', 3),
	('rappi', 'Rappi', 0.31, 0.025, 0.50, NULL, 1, '#eda100', 4);

INSERT INTO modifier_groups (name, defines_variant, notes) VALUES
	('Tipo de mollete', 1, 'Elige la receta de mollete'),
	('Proteina chilaquiles', 1, 'Elige la receta de chilaquiles'),
	('Salsa', 1, 'Elige la receta de chilaquiles / enchiladas'),
	('Proteina Sándwich', 1, 'Elige la receta de sándwich / croissant'),
	('Terminación al gusto', 0, 'Guarniciones incluidas'),
	('¿Deseas pico de gallo?', 0, NULL),
	('Pico de gallo', 0, NULL),
	('Endulzantes', 0, NULL),
	('Picante', 0, NULL);

INSERT INTO modifier_options (group_id, name, price_delta)
SELECT id, opt.name, opt.price FROM modifier_groups g
JOIN (
	SELECT 'Tipo de mollete' AS grp, 'Original' AS name, 0 AS price UNION ALL
	SELECT 'Tipo de mollete', 'Jamón', 15 UNION ALL
	SELECT 'Tipo de mollete', 'Tocino', 15 UNION ALL
	SELECT 'Proteina chilaquiles', 'Pollo (130g)', 0 UNION ALL
	SELECT 'Proteina chilaquiles', 'Carne', 20 UNION ALL
	SELECT 'Proteina chilaquiles', 'Huevo', 0 UNION ALL
	SELECT 'Salsa', 'Roja morita', 0 UNION ALL
	SELECT 'Salsa', 'Verde hoja santa', 0 UNION ALL
	SELECT 'Salsa', 'Queso manzano', 0 UNION ALL
	SELECT 'Proteina Sándwich', 'Pollo', 0 UNION ALL
	SELECT 'Proteina Sándwich', 'Atún', 20 UNION ALL
	SELECT 'Proteina Sándwich', 'Jamón y queso', 0 UNION ALL
	SELECT 'Terminación al gusto', 'Cebolla', 0 UNION ALL
	SELECT 'Terminación al gusto', 'Crema', 0 UNION ALL
	SELECT 'Terminación al gusto', 'Queso rayado', 0 UNION ALL
	SELECT 'Terminación al gusto', 'Cilantro', 0 UNION ALL
	SELECT '¿Deseas pico de gallo?', 'Si', 0 UNION ALL
	SELECT '¿Deseas pico de gallo?', 'No', 0 UNION ALL
	SELECT 'Pico de gallo', 'Si', 0 UNION ALL
	SELECT 'Pico de gallo', 'No', 0 UNION ALL
	SELECT 'Endulzantes', 'Sin endulzantes', 0 UNION ALL
	SELECT 'Endulzantes', 'Azúcar', 0 UNION ALL
	SELECT 'Picante', 'Rajas en vinagre', 0
) opt ON opt.grp = g.name;
