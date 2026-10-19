import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { AppSettings, Channel, PricingCell, PricingRow } from '../../core/models';
import { MoneyPipe, PctPipe, STATUS_LABEL } from '../../core/format';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';
import { SimulatorDialog } from './simulator.dialog';

@Component({
  selector: 'app-pricing',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
    ChannelBadgeComponent,
    MoneyPipe,
    PctPipe
  ],
  templateUrl: './pricing.page.html',
  styleUrl: './pricing.page.scss'
})
export class PricingPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);

  readonly rows = signal<PricingRow[]>([]);
  readonly channels = signal<Channel[]>([]);
  readonly settings = signal<AppSettings | null>(null);
  readonly loading = signal(false);
  readonly search = signal('');
  readonly category = signal<string | null>(null);
  readonly onlyProblems = signal(false);
  readonly statusLabel = STATUS_LABEL;

  readonly categories = computed(() => [...new Set(this.rows().map((r) => r.category || 'Sin categoría'))].sort());
  readonly filtered = computed(() => {
    const term = this.norm(this.search());
    return this.rows().filter(
      (r) =>
        (!term || this.norm(r.name).includes(term)) &&
        (!this.category() || (r.category || 'Sin categoría') === this.category()) &&
        (!this.onlyProblems() || r.channels.some((c) => c.status === 'perdida' || c.status === 'bajo'))
    );
  });
  readonly counts = computed(() => {
    const cells = this.rows().flatMap((r) => r.channels);
    return {
      perdida: cells.filter((c) => c.status === 'perdida').length,
      bajo: cells.filter((c) => c.status === 'bajo').length,
      ok: cells.filter((c) => c.status === 'ok').length
    };
  });

  constructor() {
    effect(() => {
      this.live.catalogVersion();
      untracked(() => this.load());
    });
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const r = await this.api.pricing();
      this.rows.set(r.rows);
      this.channels.set(r.channels);
      this.settings.set(r.settings);
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  cell(row: PricingRow, ch: Channel): PricingCell | undefined {
    return row.channels.find((c) => c.channel_id === ch.id);
  }

  async setPrice(row: PricingRow, ch: Channel, value: string | number | null): Promise<void> {
    const price = value === '' || value === null ? null : Number(value);
    if (price !== null && (Number.isNaN(price) || price < 0)) return;
    if (price === (this.cell(row, ch)?.price ?? null)) return;
    try {
      await this.api.setPrice(row.recipe_id, ch.id, price);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  async applyOne(row: PricingRow, ch: Channel): Promise<void> {
    try {
      await this.api.applySuggested([{ recipe_id: row.recipe_id, channel_id: ch.id }]);
      this.ui.ok(`${row.name} en ${ch.name} actualizado al precio sugerido`);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  async applyChannel(ch: Channel, statuses: string[]): Promise<void> {
    const targets = this.filtered()
      .filter((r) => statuses.includes(this.cell(r, ch)?.status || ''))
      .map((r) => ({ recipe_id: r.recipe_id, channel_id: ch.id }));
    if (!targets.length) {
      this.ui.ok('No hay productos que ajustar');
      return;
    }
    const ok = await this.ui.confirm({
      title: `Ajustar precios en ${ch.name}`,
      message: `Se aplicará el precio sugerido a ${targets.length} producto(s). Recuerda actualizarlos también en la plataforma.`,
      confirm: 'Aplicar'
    });
    if (!ok) return;
    try {
      const r = await this.api.applySuggested(targets);
      this.ui.ok(`${r.changed} precio(s) actualizados`);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  simulate(row: PricingRow, ch?: Channel): void {
    this.dialog.open(SimulatorDialog, {
      data: { row, channels: this.channels(), settings: this.settings(), channelId: ch?.id },
      width: '640px',
      maxWidth: '96vw'
    });
  }

  norm(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }
}
