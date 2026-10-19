-- =====================================================================
-- 010_commission_iva.sql
-- Las plataformas cobran IVA (16%) sobre su comisión. Verificado con la
-- liquidación semanal de DiDi: "IVA de la aplicación" = 16% de la
-- comisión. Ese IVA reduce el depósito, pero es IVA acreditable: se
-- resta del IVA a pagar, así que no cambia la utilidad.
-- =====================================================================

ALTER TABLE orders ADD COLUMN commission_iva_amount REAL NOT NULL DEFAULT 0;

-- Recalcular pedidos ya registrados
UPDATE orders
SET commission_iva_amount = ROUND(commission_amount * iva_rate, 2),
	payout_amount = ROUND(payout_amount - commission_amount * iva_rate, 2);
