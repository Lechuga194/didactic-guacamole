import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChartConfiguration } from 'chart.js';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { DaySummary } from '../../core/models';
import {
  MoneyPipe,
  PctPipe,
  addDays,
  delta,
  fmtLongDate,
  fmtMoney,
  fmtPct,
  today,
} from '../../core/format';
import { KpiCardComponent } from '../../shared/kpi-card.component';
import { ChartComponent } from '../../shared/chart.component';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';
import { baseOptions } from '../../shared/chart-theme';

@Component({
  selector: 'app-today',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
    KpiCardComponent,
    ChartComponent,
    ChannelBadgeComponent,
    MoneyPipe,
    PctPipe,
  ],
  templateUrl: './today.page.html',
  styleUrl: './today.page.scss',
})
export class TodayPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private router = inject(Router);

  readonly date = signal(today());
  readonly data = signal<DaySummary | null>(null);
  readonly loading = signal(false);
  readonly isToday = computed(() => this.date() === today());
  readonly title = computed(() => fmtLongDate(this.date()));

  readonly t = computed(() => this.data()?.totals);
  readonly prev = computed(() => this.data()?.compare.totals);
  readonly d = (key: 'net_sale' | 'profit_amount' | 'orders' | 'avg_ticket') =>
    computed(() => {
      const t = this.t();
      const p = this.prev();
      return t && p && p.orders ? delta(t[key], p[key]) : null;
    });
  readonly dNet = this.d('net_sale');
  readonly dProfit = this.d('profit_amount');
  readonly dOrders = this.d('orders');

  /** Reparto de cada peso de venta neta */
  readonly split = computed(() => {
    const t = this.t();
    if (!t || t.net_sale <= 0) return [];
    const parts = [
      { label: 'Costo de producción', value: t.cost_amount, color: 'var(--viz-seq)' },
      { label: 'Comisión plataformas', value: t.commission_amount, color: '#eb6834' },
      { label: 'IVA', value: t.iva_amount, color: 'var(--text-muted)' },
      { label: 'ISR retenido', value: t.isr_ret_amount, color: 'var(--text-secondary)' },
      { label: 'Utilidad', value: Math.max(0, t.profit_amount), color: 'var(--good)' },
    ];
    const total = parts.reduce((a, p) => a + p.value, 0) || 1;
    return parts.map((p) => ({ ...p, pct: p.value / total }));
  });

  readonly hourChart = computed(() => {
    const data = this.data();
    return (dark: boolean): ChartConfiguration => {
      const hours = data?.by_hour || [];
      const first = Math.min(8, ...hours.map((h) => h.hour));
      const last = Math.max(22, ...hours.map((h) => h.hour));
      const labels: string[] = [];
      const net: number[] = [];
      const profit: number[] = [];
      for (let h = first; h <= last; h++) {
        const row = hours.find((x) => x.hour === h);
        labels.push(`${h}:00`);
        net.push(row?.net_sale || 0);
        profit.push(row?.profit || 0);
      }
      return {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Venta neta',
              data: net,
              backgroundColor: dark ? '#3987e5' : '#2a78d6',
              borderRadius: 4,
              maxBarThickness: 22,
              borderSkipped: 'start',
            },
            {
              label: 'Utilidad',
              data: profit,
              backgroundColor: dark ? '#199e70' : '#1baf7a',
              borderRadius: 4,
              maxBarThickness: 22,
              borderSkipped: 'start',
            },
          ],
        },
        options: { ...baseOptions(), interaction: { mode: 'index', intersect: false } },
      };
    };
  });

  constructor() {
    effect(() => {
      this.live.ordersVersion();
      this.live.catalogVersion();
      const date = this.date();
      untracked(() => this.load(date));
    });
  }

  async load(date: string): Promise<void> {
    this.loading.set(true);
    try {
      this.data.set(await this.api.day(date));
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  shift(days: number): void {
    const next = addDays(this.date(), days);
    if (next <= today()) this.date.set(next);
  }

  open(id: number): void {
    this.router.navigate(['/venta', id]);
  }

  money = fmtMoney;
  pct = fmtPct;
  today = today;
}
