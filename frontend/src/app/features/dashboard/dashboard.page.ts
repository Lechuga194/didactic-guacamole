import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart, ChartConfiguration, Plugin } from 'chart.js';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { Dashboard, MenuClass, ProductStat } from '../../core/models';
import { MoneyPipe, PctPipe, addDays, delta, fmtMoney, fmtPct, parseDate, today } from '../../core/format';
import { KpiCardComponent } from '../../shared/kpi-card.component';
import { ChartComponent } from '../../shared/chart.component';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';
import { baseOptions, cssVar, seriesColor } from '../../shared/chart-theme';

type Preset = '7d' | '30d' | 'mes' | 'mes_ant' | '90d' | 'custom';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const MENU_INFO: Record<MenuClass, { label: string; icon: string; advice: string }> = {
  estrella: { label: 'Estrella', icon: 'star', advice: 'Se vende mucho y deja buen margen. Cuídalo, dale visibilidad y no lo descuentes.' },
  caballo: {
    label: 'Caballo de batalla',
    icon: 'directions_run',
    advice: 'Se vende mucho pero deja poco. Sube un poco el precio o baja su costo (porción, empaque).'
  },
  enigma: { label: 'Enigma', icon: 'help', advice: 'Deja buen margen pero se vende poco. Promuévelo: foto, posición en el menú, combos.' },
  perro: { label: 'Perro', icon: 'pets', advice: 'Se vende poco y deja poco. Rediseña la receta o considera quitarlo del menú.' }
};

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressBarModule,
    KpiCardComponent,
    ChartComponent,
    ChannelBadgeComponent,
    MoneyPipe,
    PctPipe
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  readonly ui = inject(UiService);

  readonly preset = signal<Preset>('30d');
  readonly from = signal(addDays(today(), -29));
  readonly to = signal(today());
  readonly data = signal<Dashboard | null>(null);
  readonly loading = signal(false);
  readonly productMetric = signal<'units' | 'profit'>('units');
  readonly menuInfo = MENU_INFO;
  readonly weekdays = WEEKDAYS;

  readonly d = (key: 'net_sale' | 'profit_amount' | 'orders' | 'avg_ticket' | 'commission_amount') =>
    computed(() => {
      const x = this.data();
      return x && x.previous.orders ? delta(x.totals[key], x.previous[key]) : null;
    });
  readonly dNet = this.d('net_sale');
  readonly dProfit = this.d('profit_amount');
  readonly dOrders = this.d('orders');
  readonly dTicket = this.d('avg_ticket');

  readonly channelMax = computed(() => Math.max(1, ...(this.data()?.by_channel || []).map((c) => c.net_sale)));

  // ---------------- gráfica diaria ----------------
  readonly dailyChart = computed(() => {
    const data = this.data();
    return (dark: boolean): ChartConfiguration => {
      const days = data?.daily || [];
      const long = days.length > 45;
      const labels = days.map((p) => {
        const d = parseDate(p.date);
        return long ? `${d.getDate()}/${d.getMonth() + 1}` : `${WEEKDAYS[d.getDay()]} ${d.getDate()}`;
      });
      const net = seriesColor('#2a78d6', dark);
      const profit = seriesColor('#1baf7a', dark);
      return {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Venta neta',
              data: days.map((p) => p.net_sale),
              borderColor: net,
              backgroundColor: net + '22',
              fill: true,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              cubicInterpolationMode: 'monotone'
            },
            {
              label: 'Utilidad',
              data: days.map((p) => p.profit),
              borderColor: profit,
              backgroundColor: profit,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              cubicInterpolationMode: 'monotone'
            }
          ]
        },
        options: { ...baseOptions(), interaction: { mode: 'index', intersect: false } }
      };
    };
  });

  // ---------------- productos ----------------
  readonly topProducts = computed<ProductStat[]>(() => {
    const d = this.data();
    if (!d) return [];
    return this.productMetric() === 'units' ? d.top_by_units : d.top_by_profit;
  });

  readonly productChart = computed(() => {
    const rows = this.topProducts();
    const metric = this.productMetric();
    return (dark: boolean): ChartConfiguration => ({
      type: 'bar',
      data: {
        labels: rows.map((r) => r.name),
        datasets: [
          {
            label: metric === 'units' ? 'Unidades' : 'Utilidad',
            data: rows.map((r) => (metric === 'units' ? r.units : r.profit)),
            backgroundColor: rows.map((r) =>
              (metric === 'units' ? true : r.profit >= 0) ? seriesColor('#2a78d6', dark) : cssVar('--critical')
            ),
            borderRadius: 4,
            maxBarThickness: 18,
            borderSkipped: 'start'
          }
        ]
      },
      options: this.horizontalOptions(metric === 'profit')
    });
  });

  // ---------------- ingeniería de menú ----------------
  readonly menuChart = computed(() => {
    const menu = this.data()?.menu;
    return (dark: boolean): ChartConfiguration => {
      const rows = menu?.rows || [];
      const totalUnits = rows.reduce((a, r) => a + r.units, 0) || 1;
      const popLine = (menu?.popularity_threshold || 0) * totalUnits;
      const marginLine = menu?.margin_threshold || 0;
      const quadrants: Plugin = {
        id: 'quadrants',
        beforeDatasetsDraw: (chart: Chart) => {
          const { ctx, chartArea, scales } = chart;
          const xs = scales['x'];
          const ys = scales['y'];
          const x = xs.getPixelForValue(popLine);
          const y = ys.getPixelForValue(marginLine);
          ctx.save();
          ctx.strokeStyle = cssVar('--viz-axis');
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, chartArea.top);
          ctx.lineTo(x, chartArea.bottom);
          ctx.moveTo(chartArea.left, y);
          ctx.lineTo(chartArea.right, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = cssVar('--text-muted');
          ctx.font = '500 12px Roboto, sans-serif';
          ctx.textBaseline = 'top';
          ctx.textAlign = 'left';
          ctx.fillText('ENIGMAS', chartArea.left + 8, chartArea.top + 6);
          ctx.fillText('PERROS', chartArea.left + 8, chartArea.bottom - 20);
          ctx.textAlign = 'right';
          ctx.fillText('ESTRELLAS', chartArea.right - 8, chartArea.top + 6);
          ctx.fillText('CABALLOS DE BATALLA', chartArea.right - 8, chartArea.bottom - 20);
          ctx.restore();
        }
      };
      const color = seriesColor('#2a78d6', dark);
      const opts = baseOptions(false) as Record<string, unknown> & { scales: Record<string, Record<string, unknown>>; plugins: Record<string, unknown> };
      return {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Productos',
              data: rows.map((r) => ({ x: r.units, y: r.profit_per_unit })),
              backgroundColor: color,
              borderColor: cssVar('--card-bg'),
              borderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }
          ]
        },
        options: {
          ...opts,
          interaction: { mode: 'nearest', intersect: true },
          plugins: {
            ...opts.plugins,
            legend: { display: false },
            tooltip: {
              ...(opts.plugins['tooltip'] as object),
              callbacks: {
                title: (items: { dataIndex: number }[]) => rows[items[0].dataIndex]?.name || '',
                label: (item: { dataIndex: number }) => {
                  const r = rows[item.dataIndex];
                  return `${r.units} uds · ${fmtMoney(r.profit_per_unit)} por unidad · ${MENU_INFO[r.classification].label}`;
                }
              }
            }
          },
          scales: {
            x: { ...opts.scales['x'], title: { display: true, text: 'Unidades vendidas (popularidad)', color: cssVar('--text-muted') }, grid: { color: cssVar('--viz-grid') } },
            y: {
              ...opts.scales['y'],
              title: { display: true, text: 'Utilidad por unidad', color: cssVar('--text-muted') },
              ticks: { color: cssVar('--text-muted'), callback: (v: unknown) => fmtMoney(Number(v), true) }
            }
          }
        } as ChartConfiguration['options'],
        plugins: [quadrants]
      };
    };
  });

  readonly menuGroups = computed(() => {
    const rows = this.data()?.menu.rows || [];
    return (['estrella', 'caballo', 'enigma', 'perro'] as MenuClass[]).map((k) => ({
      key: k,
      ...MENU_INFO[k],
      items: rows.filter((r) => r.classification === k).sort((a, b) => b.units - a.units)
    }));
  });

  // ---------------- mapa de calor ----------------
  readonly heat = computed(() => {
    const cells = this.data()?.heatmap || [];
    const hours = cells.map((c) => c.hour);
    const from = Math.min(8, ...hours);
    const to = Math.max(22, ...hours);
    const max = Math.max(1, ...cells.map((c) => c.orders));
    const hourList = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    // Lunes primero
    const order = [1, 2, 3, 4, 5, 6, 0];
    return {
      hours: hourList,
      rows: order.map((wd) => ({
        label: WEEKDAYS[wd],
        cells: hourList.map((h) => {
          const c = cells.find((x) => x.weekday === wd && x.hour === h);
          return { hour: h, orders: c?.orders || 0, net: c?.net_sale || 0, level: c ? c.orders / max : 0 };
        })
      }))
    };
  });

  readonly categoryMax = computed(() => Math.max(1, ...(this.data()?.by_category || []).map((c) => c.sales)));

  constructor() {
    effect(() => {
      this.live.ordersVersion();
      const from = this.from();
      const to = this.to();
      untracked(() => this.load(from, to));
    });
  }

  async load(from: string, to: string): Promise<void> {
    if (!from || !to || from > to) return;
    this.loading.set(true);
    try {
      this.data.set(await this.api.dashboard(from, to));
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  applyPreset(p: Preset): void {
    const t = today();
    this.preset.set(p);
    if (p === '7d') this.setRange(addDays(t, -6), t);
    else if (p === '30d') this.setRange(addDays(t, -29), t);
    else if (p === '90d') this.setRange(addDays(t, -89), t);
    else if (p === 'mes') this.setRange(t.slice(0, 8) + '01', t);
    else if (p === 'mes_ant') {
      const firstThis = t.slice(0, 8) + '01';
      const lastPrev = addDays(firstThis, -1);
      this.setRange(lastPrev.slice(0, 8) + '01', lastPrev);
    }
  }

  private setRange(from: string, to: string): void {
    this.from.set(from);
    this.to.set(to);
  }

  /** Barras horizontales: el eje de valores va abajo con retícula fina, los nombres a la izquierda. */
  private horizontalOptions(money: boolean): ChartConfiguration['options'] {
    const base = baseOptions(money);
    return {
      ...base,
      indexAxis: 'y',
      interaction: { mode: 'nearest', axis: 'y', intersect: false },
      plugins: { ...base.plugins, legend: { display: false } },
      scales: {
        x: {
          grid: { color: cssVar('--viz-grid') },
          border: { display: false },
          ticks: { color: cssVar('--text-muted'), callback: money ? (v) => fmtMoney(Number(v), true) : undefined }
        },
        y: {
          grid: { display: false },
          border: { color: cssVar('--viz-axis') },
          ticks: { color: cssVar('--text-secondary'), autoSkip: false }
        }
      }
    } as ChartConfiguration['options'];
  }

  heatColor(level: number): string {
    if (!level) return 'transparent';
    return `color-mix(in srgb, var(--viz-seq) ${Math.round(15 + level * 85)}%, var(--card-bg))`;
  }

  money = fmtMoney;
  pct = fmtPct;
  exportUrl = computed(() => this.api.exportUrl(this.from(), this.to()));
}
