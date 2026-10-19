import { Pipe, PipeTransform } from '@angular/core';

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
const moneyShort = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });

export const fmtMoney = (v: number | null | undefined, short = false): string =>
  v === null || v === undefined || Number.isNaN(v) ? '—' : (short ? moneyShort : money).format(v);

export const fmtPct = (v: number | null | undefined, digits = 0): string =>
  v === null || v === undefined || Number.isNaN(v) ? '—' : `${(v * 100).toFixed(digits)}%`;

export const fmtNum = (v: number | null | undefined): string => (v === null || v === undefined ? '—' : num.format(v));

const pad = (n: number) => String(n).padStart(2, '0');
export const toDate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toStamp = (d: Date): string => `${toDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const today = (): string => toDate(new Date());
export const addDays = (date: string, days: number): string => {
  const [y, m, d] = date.split('-').map(Number);
  return toDate(new Date(y, m - 1, d + days));
};
export const parseDate = (date: string): Date => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const longDate = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
export const fmtLongDate = (date: string): string => {
  const s = longDate.format(parseDate(date));
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Variación porcentual con signo (para comparar contra el periodo anterior) */
export const delta = (current: number, previous: number): number | null =>
  previous ? (current - previous) / Math.abs(previous) : null;

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(v: number | null | undefined, short = false): string {
    return fmtMoney(v, short);
  }
}

const unitMoney = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 4 });

/** Costo por g / ml / pieza: muestra hasta 4 decimales cuando el monto es menor a $1 */
@Pipe({ name: 'unitCost' })
export class UnitCostPipe implements PipeTransform {
  transform(v: number | null | undefined): string {
    if (v === null || v === undefined || Number.isNaN(v)) return '—';
    return Math.abs(v) < 1 ? unitMoney.format(v) : money.format(v);
  }
}

@Pipe({ name: 'pct' })
export class PctPipe implements PipeTransform {
  transform(v: number | null | undefined, digits = 0): string {
    return fmtPct(v, digits);
  }
}

@Pipe({ name: 'qty' })
export class QtyPipe implements PipeTransform {
  transform(v: number | null | undefined): string {
    return fmtNum(v);
  }
}

export const KIND_LABEL: Record<string, string> = {
  preparacion: 'Preparación',
  producto_final: 'Producto final',
  combo: 'Combo'
};

export const STATUS_LABEL: Record<string, { label: string; icon: string }> = {
  ok: { label: 'En meta', icon: 'check_circle' },
  bajo: { label: 'Margen bajo', icon: 'warning' },
  perdida: { label: 'Pérdida', icon: 'error' },
  sin_precio: { label: 'Sin precio', icon: 'remove_circle_outline' }
};
