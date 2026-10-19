-- =====================================================================
-- 014_recipe_price_reviewed_at.sql
-- Fecha y hora en que se revisó por última vez el precio de cada receta
-- (se marca con un clic en la lista de recetas).
-- =====================================================================

ALTER TABLE recipes ADD COLUMN price_reviewed_at TEXT;
