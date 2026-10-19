-- =====================================================================
-- 008_settings_portal_urls.sql
-- Direcciones de los portales de tienda que abre la pantalla
-- "Plataformas" (una ventana por plataforma, acomodadas en tercios).
-- =====================================================================

INSERT OR IGNORE INTO settings (key, value, description) VALUES
	('portal_url_didi', 'https://didi-food.com/es-MX/store/pc/order', 'Portal de pedidos de DiDi Food'),
	('portal_url_uber', 'https://merchants-beta.ubereats.com/orders/overview', 'Portal de pedidos de Uber Eats'),
	('portal_url_rappi', 'https://aliados.rappi.com/orders-kanban', 'Portal de pedidos de Rappi');
