-- =====================================================================
-- 011_ingredient_price_volatile.sql
-- Marcador visual para ingredientes cuyo precio fluctúa mucho
-- (se activa a mano desde la tabla de ingredientes).
-- =====================================================================

ALTER TABLE ingredients ADD COLUMN price_volatile INTEGER NOT NULL DEFAULT 0 CHECK (price_volatile IN (0, 1));
