import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { AppSettings, Channel, PricingRow } from '../../core/models';
import { MoneyPipe, PctPipe } from '../../core/format';
import { breakdown, suggestedPrice } from '../../core/pricing';

interface SimData {
  row: PricingRow;
  channels: Channel[];
  settings: AppSettings;
  channelId?: number;
}

/** Simulador: mueve el precio y ve al instante cuánto te deja en cada canal. */
@Component({
  selector: 'app-simulator',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatIconModule,
    MoneyPipe,
    PctPipe,
  ],
  template: `
    <h2 mat-dialog-title>Simulador · {{ data.row.name }}</h2>
    <mat-dialog-content>
      <mat-button-toggle-group [value]="channelId()" (change)="pick($event.value)" class="channels">
        @for (c of data.channels; track c.id) {
          <mat-button-toggle [value]="c.id">{{ c.name }}</mat-button-toggle>
        }
      </mat-button-toggle-group>

      <div class="price-box">
        <div>
          <div class="muted">Precio de venta</div>
          <div class="price">{{ price() | money }}</div>
        </div>
        <div class="right">
          <div class="muted">Actual: {{ current() | money }}</div>
          <div class="muted">Sugerido ({{ target() | pct }}): {{ suggested() | money }}</div>
        </div>
      </div>
      <mat-slider [min]="min()" [max]="max()" step="1" discrete class="full">
        <input matSliderThumb [ngModel]="price()" (ngModelChange)="price.set($event)" />
      </mat-slider>

      <div class="bars" role="img" aria-label="Reparto del precio">
        @for (p of parts(); track p.label) {
          @if (p.value > 0) {
            <div class="seg" [style.flex-grow]="p.value" [style.background]="p.color"></div>
          }
        }
      </div>
      <table class="simple">
        <tbody>
          @for (p of parts().slice(0, -1); track p.label) {
            <tr>
              <td><span class="dot" [style.background]="p.color"></span> {{ p.label }}</td>
              <td class="num">{{ p.value | money }}</td>
              <td class="num muted">{{ price() ? (p.value / price() | pct) : '—' }}</td>
            </tr>
          }
          <tr class="profit" [class.neg]="calc().profit < 0">
            <td>
              <span class="dot" style="background: var(--good)"></span>
              <strong>Utilidad real</strong>
            </td>
            <td class="num">
              <strong>{{ calc().profit | money }}</strong>
            </td>
            <td class="num">
              <strong>{{ calc().margin | pct }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="muted small">
        Cada $10 extra de precio en este canal te dejan {{ perTen() | money }} más. Depósito
        esperado: {{ calc().payout | money }}.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
      <button
        mat-flat-button
        (click)="use()"
        [disabled]="price() === current()"
        title="Queda pendiente hasta presionar Guardar en la tabla"
      >
        Usar {{ price() | money }} en este canal
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .channels {
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .price-box {
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .price {
        font-size: 36px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 4px;
      }
      .right {
        text-align: right;
      }
    }
    .full {
      width: 100%;
    }
    .bars {
      display: flex;
      gap: 2px;
      height: 20px;
      border-radius: 6px;
      overflow: hidden;
      margin: 8px 0 12px;
    }
    .profit td {
      border-top: 1px solid var(--viz-axis);
    }
    .neg td {
      color: var(--critical-text);
    }
    .small {
      font: var(--mat-sys-body-small);
    }
  `,
})
export class SimulatorDialog {
  readonly data = inject<SimData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<SimulatorDialog>);

  readonly channelId = signal(this.data.channelId ?? this.data.channels[0]?.id);
  readonly channel = computed(
    () => this.data.channels.find((c) => c.id === this.channelId()) as Channel,
  );
  readonly cell = computed(() =>
    this.data.row.channels.find((c) => c.channel_id === this.channelId()),
  );
  readonly current = computed(() => this.cell()?.price ?? 0);
  readonly target = computed(
    () => this.channel()?.target_margin_pct ?? this.data.settings.target_margin_pct,
  );
  readonly suggested = computed(() =>
    suggestedPrice(
      this.data.row.cost_unit,
      this.channel(),
      this.data.settings.iva_rate,
      this.target(),
      this.data.settings.price_rounding,
    ),
  );
  readonly price = signal(this.current() || this.suggested() || 50);
  readonly min = computed(() => Math.max(0, Math.floor(this.data.row.cost_unit)));
  readonly max = computed(() =>
    Math.ceil(Math.max(this.suggested() || 0, this.current(), this.data.row.cost_unit * 5) * 1.3),
  );
  readonly calc = computed(() =>
    breakdown(this.price(), this.data.row.cost_unit, this.channel(), this.data.settings.iva_rate),
  );
  readonly perTen = computed(
    () => breakdown(10, 0, this.channel(), this.data.settings.iva_rate).profit,
  );
  readonly parts = computed(() => {
    const b = this.calc();
    return [
      {
        label: 'Costo (insumos + empaque)',
        value: this.data.row.cost_unit,
        color: 'var(--viz-seq)',
      },
      { label: `Comisión ${this.channel().name}`, value: b.commission, color: '#eb6834' },
      { label: 'IVA', value: b.iva, color: 'var(--text-muted)' },
      { label: 'ISR retenido', value: b.isr, color: 'var(--text-secondary)' },
      { label: 'Utilidad', value: Math.max(0, b.profit), color: 'var(--good)' },
    ];
  });

  pick(id: number): void {
    this.channelId.set(id);
    this.price.set(this.current() || this.suggested() || this.price());
  }

  /** Devuelve el precio a la tabla como cambio pendiente (no se guarda aquí) */
  use(): void {
    this.ref.close({ channel_id: this.channelId(), price: this.price() });
  }
}
