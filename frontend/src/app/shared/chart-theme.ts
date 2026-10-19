import { Chart, ChartOptions, registerables } from 'chart.js';
import { fmtMoney } from '../core/format';

Chart.register(...registerables);

/** Paso oscuro de cada color de la paleta categórica validada (mismo tono, ajustado a fondo oscuro). */
const DARK_STEP: Record<string, string> = {
  '#2a78d6': '#3987e5',
  '#eb6834': '#d95926',
  '#1baf7a': '#199e70',
  '#eda100': '#c98500',
  '#e87ba4': '#d55181',
  '#008300': '#008300',
  '#6250d6': '#9085e9',
  '#e34948': '#e66767',
};

/** Orden fijo de la paleta categórica (nunca se recicla: más series se agrupan en "Otros"). */
export const CATEGORICAL = [
  '#2a78d6',
  '#eb6834',
  '#1baf7a',
  '#eda100',
  '#e87ba4',
  '#008300',
  '#6250d6',
  '#e34948',
];

export const seriesColor = (hex: string, dark: boolean): string =>
  dark ? DARK_STEP[hex.toLowerCase()] || hex : hex;

export const cssVar = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';

/** Opciones base: ejes discretos, retícula fina, tooltips con formato de moneda. */
export const baseOptions = (money = true): ChartOptions => {
  const grid = cssVar('--viz-grid');
  const muted = cssVar('--text-muted');
  const text = cssVar('--text-secondary');
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    interaction: { mode: 'nearest', intersect: false },
    font: { family: 'Roboto, system-ui, sans-serif' },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          color: text,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: cssVar('--card-bg'),
        titleColor: cssVar('--text-primary'),
        bodyColor: text,
        borderColor: grid,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        usePointStyle: true,
        boxPadding: 4,
        callbacks: money
          ? {
              label: (ctx) => {
                const parsed = ctx.parsed as { y?: number; x?: number };
                const v = ctx.chart.options.indexAxis === 'y' ? parsed.x : parsed.y;
                const label = ctx.dataset.label ? `${ctx.dataset.label}: ` : '';
                return `${label}${fmtMoney(typeof v === 'number' ? v : Number(ctx.raw))}`;
              },
            }
          : {},
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: cssVar('--viz-axis') },
        ticks: { color: muted, maxRotation: 0, autoSkipPadding: 12 },
      },
      y: {
        grid: { color: grid },
        border: { display: false },
        ticks: {
          color: muted,
          callback: money ? (v) => fmtMoney(Number(v), true) : undefined,
        },
      },
    },
  } as ChartOptions;
};
