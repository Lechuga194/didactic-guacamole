-- =====================================================================
-- 012_ingredient_needs_review.sql
-- Marcador visual para ingredientes pendientes de revisar
-- (se activa a mano desde la tabla de ingredientes).
-- =====================================================================

ALTER TABLE ingredients ADD COLUMN needs_review INTEGER NOT NULL DEFAULT 0 CHECK (needs_review IN (0, 1));
