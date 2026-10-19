-- =====================================================================
-- 013_ingredient_purchase_source.sql
-- Dónde se compra cada ingrediente: en línea (por defecto) o en tienda local.
-- Sólo es un indicador visual en la tabla de ingredientes.
-- =====================================================================

ALTER TABLE ingredients ADD COLUMN purchase_source TEXT NOT NULL DEFAULT 'linea' CHECK (purchase_source IN ('linea', 'local'));
