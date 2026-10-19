-- =====================================================================
-- 009_channel_priority.sql
-- Prioridad de canales en toda la app: DiDi (1), Rappi (2),
-- Venta directa (3), Uber Eats (4).
-- Los colores se reasignan para que canales vecinos sigan siendo
-- distinguibles (paleta validada para daltonismo en este orden):
-- DiDi naranja, Rappi azul, Directo amarillo, Uber aqua.
-- =====================================================================

UPDATE channels SET sort_order = 1, color = '#eb6834' WHERE code = 'didi';
UPDATE channels SET sort_order = 2, color = '#2a78d6' WHERE code = 'rappi';
UPDATE channels SET sort_order = 3, color = '#eda100' WHERE code = 'directo';
UPDATE channels SET sort_order = 4, color = '#1baf7a' WHERE code = 'uber';
