-- =====================================================================
-- 016_margin_acceptance_and_hidden_alerts.sql
-- 1) Márgenes aceptados: productos/canales que se sabe que quedan bajo la
--    meta y está bien. Dejan de destacarse en Precios y en Alertas mientras
--    su margen no baje más de lo que se aceptó (accepted_margin).
-- 2) Alertas ocultas: cualquier otra alerta silenciada a mano. Vuelve a
--    aparecer si su contenido cambia (signature distinta).
-- =====================================================================

CREATE TABLE margin_acceptances (
	recipe_id       INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	channel_id      INTEGER NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
	accepted_margin REAL NOT NULL,
	accepted_at     TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
	PRIMARY KEY (recipe_id, channel_id)
);

CREATE TABLE hidden_alerts (
	alert_key  TEXT PRIMARY KEY,
	signature  TEXT NOT NULL,
	hidden_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
