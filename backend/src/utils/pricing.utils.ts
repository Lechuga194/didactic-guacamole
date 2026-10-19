import { Channel } from '../interfaces/settings';
import { OrderTotals } from '../interfaces/order';

type ChannelRates = Pick<Channel, 'commission_pct' | 'isr_ret_pct' | 'iva_ret_pct'>;

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Desglose de una venta (precio con IVA incluido):
 *   IVA trasladado = neto * iva / (1 + iva)
 *   Comisión       = neto * comisión del canal
 *   ISR retenido   = base sin IVA * tasa de retención
 *   IVA retenido   = IVA trasladado * fracción retenida (no es gasto, se acredita en la declaración)
 *   Utilidad       = neto - IVA - comisión - ISR retenido - costo
 *   Depósito       = neto - comisión - ISR retenido - IVA retenido
 */
export const breakdown = (netSale: number, cost: number, channel: ChannelRates, ivaRate: number) => {
	const iva = (netSale * ivaRate) / (1 + ivaRate);
	const base = netSale - iva;
	const commission = netSale * channel.commission_pct;
	const isr = base * channel.isr_ret_pct;
	const ivaRet = iva * channel.iva_ret_pct;
	const profit = netSale - iva - commission - isr - cost;
	return {
		iva,
		base,
		commission,
		isr,
		iva_ret: ivaRet,
		profit,
		payout: netSale - commission - isr - ivaRet,
		margin_pct: netSale > 0 ? profit / netSale : 0
	};
};

/** Fracción del precio que queda para cubrir costo + utilidad en un canal. */
export const contributionFactor = (channel: ChannelRates, ivaRate: number): number =>
	1 - ivaRate / (1 + ivaRate) - channel.commission_pct - channel.isr_ret_pct / (1 + ivaRate);

/**
 * Precio (con IVA) que deja el margen objetivo sobre el precio de venta, redondeado hacia arriba.
 * Devuelve null si el canal se lleva todo (factor <= margen).
 */
export const suggestedPrice = (
	cost: number,
	channel: ChannelRates,
	ivaRate: number,
	targetMargin: number,
	rounding = 1
): number | null => {
	const denom = contributionFactor(channel, ivaRate) - targetMargin;
	if (denom <= 0) return null;
	const raw = cost / denom;
	const step = rounding > 0 ? rounding : 0.01;
	return round2(Math.ceil(raw / step - 1e-9) * step);
};

export interface TotalsInput {
	gross_amount: number;
	discount_store: number;
	discount_platform: number;
	cost_amount: number;
}

export const orderTotals = (input: TotalsInput, channel: ChannelRates, ivaRate: number): OrderTotals => {
	const net = Math.max(0, input.gross_amount - input.discount_store);
	const b = breakdown(net, input.cost_amount, channel, ivaRate);
	return {
		gross_amount: round2(input.gross_amount),
		discount_store: round2(input.discount_store),
		discount_platform: round2(input.discount_platform),
		net_sale: round2(net),
		iva_rate: ivaRate,
		iva_amount: round2(b.iva),
		commission_pct: channel.commission_pct,
		commission_amount: round2(b.commission),
		isr_ret_pct: channel.isr_ret_pct,
		isr_ret_amount: round2(b.isr),
		iva_ret_pct: channel.iva_ret_pct,
		iva_ret_amount: round2(b.iva_ret),
		cost_amount: round2(input.cost_amount),
		profit_amount: round2(b.profit),
		payout_amount: round2(b.payout)
	};
};

export default { round2, breakdown, contributionFactor, suggestedPrice, orderTotals };
