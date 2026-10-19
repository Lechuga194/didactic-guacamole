import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { Channel, OrderListRow } from '../../core/models';
import { MoneyPipe, PctPipe, addDays, today } from '../../core/format';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';

type Preset = 'hoy' | 'ayer' | '7d' | 'mes' | '30d' | 'custom';

@Component({
  selector: 'app-orders',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
    ChannelBadgeComponent,
    MoneyPipe,
    PctPipe
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Ventas</h1>
          <div class="subtitle">Historial de pedidos con su utilidad real</div>
        </div>
        <span class="spacer"></span>
        <a mat-stroked-button [href]="exportUrl()" download><mat-icon>download</mat-icon> Exportar a Excel</a>
        <a mat-flat-button routerLink="/venta/nueva"><mat-icon>add</mat-icon> Registrar venta</a>
      </div>

      <div class="card filters">
        <mat-button-toggle-group [value]="preset()" (change)="applyPreset($event.value)" aria-label="Periodo">
          <mat-button-toggle value="hoy">Hoy</mat-button-toggle>
          <mat-button-toggle value="ayer">Ayer</mat-button-toggle>
          <mat-button-toggle value="7d">7 días</mat-button-toggle>
          <mat-button-toggle value="mes">Este mes</mat-button-toggle>
          <mat-button-toggle value="30d">30 días</mat-button-toggle>
        </mat-button-toggle-group>
        <mat-form-field appearance="outline" class="dense">
          <mat-label>Desde</mat-label>
          <input matInput type="date" [ngModel]="from()" (ngModelChange)="from.set($event); preset.set('custom')" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="dense">
          <mat-label>Hasta</mat-label>
          <input matInput type="date" [ngModel]="to()" (ngModelChange)="to.set($event); preset.set('custom')" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="dense">
          <mat-label>Canal</mat-label>
          <mat-select [ngModel]="channelId()" (ngModelChange)="channelId.set($event)">
            <mat-option [value]="null">Todos</mat-option>
            @for (c of channels(); track c.id) {
              <mat-option [value]="c.id">{{ c.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="dense">
          <mat-label>Estado</mat-label>
          <mat-select [ngModel]="status()" (ngModelChange)="status.set($event)">
            <mat-option [value]="null">Todos</mat-option>
            <mat-option value="completado">Completados</mat-option>
            <mat-option value="cancelado">Cancelados</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="dense grow">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Buscar producto, folio o nota</mat-label>
          <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)" />
        </mat-form-field>
      </div>

      @if (loading()) {
        <mat-progress-bar mode="indeterminate" />
      }

      <div class="card">
        <div class="summary">
          <div><span class="muted">Pedidos</span><strong>{{ sum().orders }}</strong></div>
          <div><span class="muted">Venta neta</span><strong>{{ sum().net | money }}</strong></div>
          <div><span class="muted">Comisiones</span><strong>{{ sum().commission | money }}</strong></div>
          <div><span class="muted">Costo</span><strong>{{ sum().cost | money }}</strong></div>
          <div>
            <span class="muted">Utilidad</span><strong [class.neg]="sum().profit < 0" [class.pos]="sum().profit >= 0">{{ sum().profit | money }}</strong>
          </div>
          <div><span class="muted">Margen</span><strong>{{ sum().net ? (sum().profit / sum().net | pct) : '—' }}</strong></div>
        </div>
        <div class="table-wrap">
          <table class="simple">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Canal</th>
                <th>Productos</th>
                <th>Folio</th>
                <th class="num">Venta neta</th>
                <th class="num">Desc.</th>
                <th class="num">Comisión</th>
                <th class="num">Costo</th>
                <th class="num">Utilidad</th>
                <th class="num">Margen</th>
              </tr>
            </thead>
            <tbody>
              @for (o of orders(); track o.id) {
                <tr class="clickable" [class.cancelled]="o.status === 'cancelado'" (click)="open(o.id)">
                  <td class="nowrap">{{ o.ordered_at.slice(0, 10) }} <span class="muted">{{ o.ordered_at.slice(11) }}</span></td>
                  <td><app-channel [name]="o.channel_name" [hex]="o.channel_color" /></td>
                  <td class="items">
                    {{ o.items_summary }}
                    @if (o.status === 'cancelado') {
                      <span class="status perdida">Cancelado</span>
                    }
                  </td>
                  <td class="muted ref">{{ o.external_ref }}</td>
                  <td class="num">{{ o.net_sale | money }}</td>
                  <td class="num muted">{{ o.discount_store ? (o.discount_store | money) : '' }}</td>
                  <td class="num">{{ o.commission_amount | money }}</td>
                  <td class="num">{{ o.cost_amount | money }}</td>
                  <td class="num" [class.neg]="o.profit_amount < 0" [class.pos]="o.profit_amount >= 0">{{ o.profit_amount | money }}</td>
                  <td class="num">{{ o.net_sale ? (o.profit_amount / o.net_sale | pct) : '—' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="10" class="empty">No hay ventas con estos filtros</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: `
    .filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 0;
      mat-button-toggle-group {
        margin-bottom: 20px;
      }
      .grow {
        flex: 1;
        min-width: 220px;
      }
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 32px;
      margin-bottom: 12px;
      div {
        display: flex;
        flex-direction: column;
      }
      strong {
        font: var(--mat-sys-title-large);
      }
    }
    .items {
      min-width: 240px;
    }
    .ref {
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .nowrap {
      white-space: nowrap;
    }
  `
})
export class OrdersPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private router = inject(Router);

  readonly preset = signal<Preset>('7d');
  readonly from = signal(addDays(today(), -6));
  readonly to = signal(today());
  readonly channelId = signal<number | null>(null);
  readonly status = signal<string | null>(null);
  readonly search = signal('');
  readonly orders = signal<OrderListRow[]>([]);
  readonly channels = signal<Channel[]>([]);
  readonly loading = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  readonly sum = computed(() => {
    const done = this.orders().filter((o) => o.status === 'completado');
    return {
      orders: done.length,
      net: done.reduce((a, o) => a + o.net_sale, 0),
      commission: done.reduce((a, o) => a + o.commission_amount, 0),
      cost: done.reduce((a, o) => a + o.cost_amount, 0),
      profit: done.reduce((a, o) => a + o.profit_amount, 0)
    };
  });
  readonly exportUrl = computed(() => this.api.exportUrl(this.from(), this.to()));

  constructor() {
    this.api.settings().then((s) => this.channels.set(s.channels));
    effect(() => {
      this.live.ordersVersion();
      const filters = {
        from: this.from(),
        to: this.to(),
        channel_id: this.channelId(),
        status: this.status(),
        search: this.search().trim()
      };
      untracked(() => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.load(filters), 200);
      });
    });
  }

  async load(filters: Record<string, string | number | null>): Promise<void> {
    this.loading.set(true);
    try {
      this.orders.set(await this.api.orders(filters));
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  applyPreset(p: Preset): void {
    const t = today();
    this.preset.set(p);
    if (p === 'hoy') this.setRange(t, t);
    else if (p === 'ayer') this.setRange(addDays(t, -1), addDays(t, -1));
    else if (p === '7d') this.setRange(addDays(t, -6), t);
    else if (p === '30d') this.setRange(addDays(t, -29), t);
    else if (p === 'mes') this.setRange(t.slice(0, 8) + '01', t);
  }

  private setRange(from: string, to: string): void {
    this.from.set(from);
    this.to.set(to);
  }

  open(id: number): void {
    this.router.navigate(['/venta', id]);
  }
}
