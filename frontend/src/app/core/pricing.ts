import { Channel } from './models';

/** Mismo cálculo que backend/src/utils/pricing.utils.ts, para simular al instante. */
export const breakdown = (
  price: number,
  cost: number,
  ch: Pick<Channel, 'commission_pct' | 'isr_ret_pct' | 'iva_ret_pct'>,
  ivaRate: number,
) => {
  const iva = (price * ivaRate) / (1 + ivaRate);
  const base = price - iva;
  const commission = price * ch.commission_pct;
  // La plataforma cobra IVA sobre su comisión: baja el depósito, pero es acreditable (no cambia la utilidad)
  const commissionIva = commission * ivaRate;
  const isr = base * ch.isr_ret_pct;
  const ivaRet = iva * ch.iva_ret_pct;
  const profit = price - iva - commission - isr - cost;
  return {
    iva,
    base,
    commission,
    commissionIva,
    isr,
    ivaRet,
    profit,
    payout: price - commission - commissionIva - isr - ivaRet,
    margin: price > 0 ? profit / price : 0,
  };
};

export const suggestedPrice = (
  cost: number,
  ch: Pick<Channel, 'commission_pct' | 'isr_ret_pct'>,
  ivaRate: number,
  margin: number,
  rounding: number,
): number | null => {
  const denom =
    1 - ivaRate / (1 + ivaRate) - ch.commission_pct - ch.isr_ret_pct / (1 + ivaRate) - margin;
  if (denom <= 0) return null;
  const step = rounding > 0 ? rounding : 0.01;
  return Math.round(Math.ceil(cost / denom / step - 1e-9) * step * 100) / 100;
};
