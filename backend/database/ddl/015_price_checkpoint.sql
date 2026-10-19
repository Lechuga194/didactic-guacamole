-- =====================================================================
-- 015_price_checkpoint.sql
-- Punto de control de precios: una sola copia de todos los precios por
-- producto y canal, guardada con un clic en "Precios y márgenes".
-- Sirve para regresar a esos precios; sólo se reemplaza manualmente.
-- price NULL = el producto no tenía precio en ese canal al guardar la copia.
-- =====================================================================

CREATE TABLE price_checkpoint (
	id         INTEGER PRIMARY KEY CHECK (id = 1),
	created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE price_checkpoint_items (
	recipe_id  INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	channel_id INTEGER NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
	price      REAL CHECK (price IS NULL OR price >= 0),
	PRIMARY KEY (recipe_id, channel_id)
);
