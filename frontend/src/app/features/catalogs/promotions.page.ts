import { Component, effect, inject, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { Channel, Promotion } from '../../core/models';
import { MoneyPipe, PctPipe } from '../../core/format';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';
import { PromotionDialog, PROMO_TYPES } from './promotion.dialog';

@Component({
  selector: 'app-promotions',
  imports: [MatButtonModule, MatIconModule, MoneyPipe, PctPipe, ChannelBadgeComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Promociones</h1>
          <div class="subtitle">Define tus promociones para aplicarlas rápido al registrar una venta y medir cuánto te cuestan</div>
        </div>
        <span class="spacer"></span>
        <button mat-flat-button (click)="edit()"><mat-icon>add</mat-icon> Nueva promoción</button>
      </div>

      <div class="card">
        <table class="simple">
          <thead>
            <tr>
              <th>Promoción</th>
              <th>Tipo</th>
              <th>Canal</th>
              <th>Quién la paga</th>
              <th>Vigencia</th>
              <th class="num">Veces usada</th>
              <th class="num">Te ha costado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of promos(); track p.id) {
              <tr class="clickable" [class.cancelled]="!p.active" (click)="edit(p)">
                <td><strong>{{ p.name }}</strong></td>
                <td>{{ typeLabel(p) }}</td>
                <td>
                  @if (channelOf(p); as c) {
                    <app-channel [name]="c.name" [hex]="c.color" />
                  } @else {
                    <span class="muted">Todos</span>
                  }
                </td>
                <td>
                  {{ p.absorbed_by === 'tienda' ? 'Tú' : p.absorbed_by === 'plataforma' ? 'Plataforma' : 'Compartida (' + (p.store_share_pct | pct) + ' tú)' }}
                </td>
                <td class="muted">{{ p.starts_on || '—' }} → {{ p.ends_on || '—' }}</td>
                <td class="num">{{ p.times_used }}</td>
                <td class="num">{{ p.store_cost | money }}</td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="empty">Sin promociones registradas</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PromotionsPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);
  readonly promos = signal<Promotion[]>([]);
  readonly channels = signal<Channel[]>([]);

  constructor() {
    this.api.settings().then((s) => this.channels.set(s.channels));
    effect(() => {
      this.live.catalogVersion();
      this.live.ordersVersion();
      untracked(() => this.load());
    });
  }

  async load(): Promise<void> {
    try {
      this.promos.set(await this.api.promotions());
    } catch (err) {
      this.ui.error(err);
    }
  }

  channelOf(p: Promotion): Channel | undefined {
    return this.channels().find((c) => c.id === p.channel_id);
  }

  typeLabel(p: Promotion): string {
    const t = PROMO_TYPES.find((x) => x.value === p.type);
    if (p.type === 'porcentaje') return `${p.value}% de descuento`;
    if (p.type === 'monto_fijo') return `$${p.value} de descuento`;
    if (p.type === 'precio_especial') return `Precio especial $${p.value}`;
    return t?.label || p.type;
  }

  edit(p?: Promotion): void {
    this.dialog
      .open(PromotionDialog, { data: { promo: p ?? null, channels: this.channels() }, width: '640px', maxWidth: '96vw' })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) this.load();
      });
  }
}
