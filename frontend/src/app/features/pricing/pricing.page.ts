import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  signal,
  untracked,
} from '@angular/core';
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
import { AppSettings, Channel, PriceCheckpoint, PricingCell, PricingRow } from '../../core/models';
import { MoneyPipe, PctPipe, STATUS_LABEL } from '../../core/format';
import { breakdown } from '../../core/pricing';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';
import { SimulatorDialog } from './simulator.dialog';

const keyOf = (recipeId: number, channelId: number): string => `${recipeId}:${channelId}`;

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
    PctPipe,
  ],
  templateUrl: './pricing.page.html',
  styleUrl: './pricing.page.scss',
})
export class PricingPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);

  /** Precios tal como están guardados en la base */
  readonly rows = signal<PricingRow[]>([]);
  readonly channels = signal<Channel[]>([]);
  readonly settings = signal<AppSettings | null>(null);
  readonly loading = signal(false);
  readonly search = signal('');
  readonly category = signal<string | null>(null);
  readonly onlyProblems = signal(false);
  readonly statusLabel = STATUS_LABEL;

  // ---------- Cambios pendientes (no se guardan hasta presionar Guardar) ----------
  /** "receta:canal" → precio nuevo (null = quitar precio) */
  readonly pending = signal(new Map<string, number | null>());
  readonly pendingCount = computed(() => this.pending().size);
  readonly saving = signal(false);

  // ---------- Punto de control (copia de precios para regresar a ellos) ----------
  readonly checkpoint = signal<PriceCheckpoint | null>(null);
  readonly savingCheckpoint = signal(false);
  /** Precios que cambiarían al restaurar el punto de control (contra lo que se ve en la tabla) */
  readonly checkpointDiff = computed(() => {
    const cp = this.checkpoint();
    const out: { recipe_id: number; channel_id: number; price: number | null }[] = [];
    if (!cp) return out;
    const saved = new Map(cp.items.map((i) => [keyOf(i.recipe_id, i.channel_id), i.price]));
    for (const r of this.view()) {
      for (const c of r.channels) {
        const key = keyOf(r.recipe_id, c.channel_id);
        // Productos o canales creados después de la copia no se tocan
        if (!saved.has(key)) continue;
        const price = saved.get(key) ?? null;
        if (price !== c.price)
          out.push({ recipe_id: r.recipe_id, channel_id: c.channel_id, price });
      }
    }
    return out;
  });

  /** Filas con los cambios pendientes ya aplicados y su utilidad/margen recalculados */
  readonly view = computed<PricingRow[]>(() => {
    const pending = this.pending();
    const settings = this.settings();
    if (!pending.size || !settings) return this.rows();
    const chById = new Map(this.channels().map((c) => [c.id, c]));
    return this.rows().map((r) => {
      if (!r.channels.some((c) => pending.has(keyOf(r.recipe_id, c.channel_id)))) return r;
      return {
        ...r,
        channels: r.channels.map((c) => {
          const key = keyOf(r.recipe_id, c.channel_id);
          const ch = chById.get(c.channel_id);
          return pending.has(key) && ch
            ? this.recalc(c, r.cost_unit, pending.get(key) ?? null, ch, settings.iva_rate)
            : c;
        }),
      };
    });
  });

  readonly categories = computed(() =>
    [...new Set(this.rows().map((r) => r.category || 'Sin categoría'))].sort(),
  );
  readonly filtered = computed(() => {
    const term = this.norm(this.search());
    return this.view().filter(
      (r) =>
        (!term || this.norm(r.name).includes(term)) &&
        (!this.category() || (r.category || 'Sin categoría') === this.category()) &&
        (!this.onlyProblems() ||
          r.channels.some((c) => c.status === 'perdida' || c.status === 'bajo')),
    );
  });
  readonly counts = computed(() => {
    const cells = this.view().flatMap((r) => r.channels);
    return {
      perdida: cells.filter((c) => c.status === 'perdida').length,
      bajo: cells.filter((c) => c.status === 'bajo').length,
      ok: cells.filter((c) => c.status === 'ok').length,
    };
  });

  // ---------- Regular precios entre plataformas ----------
  readonly platforms = computed(() => this.channels().filter((c) => c.is_platform));
  readonly syncSource = signal<number | null>(null);
  readonly syncSourceChannel = computed(
    () => this.platforms().find((c) => c.id === this.syncSource()) || null,
  );
  readonly syncTargets = computed(() => this.platforms().filter((c) => c.id !== this.syncSource()));
  readonly syncTargetNames = computed(() =>
    this.syncTargets()
      .map((c) => c.name)
      .join(', '),
  );
  /** Precios que cambiarían al copiar del canal de origen a los demás (contando lo pendiente) */
  readonly syncDiff = computed(() => {
    const src = this.syncSource();
    const out: { recipe_id: number; channel_id: number; price: number }[] = [];
    if (!src) return out;
    const targets = this.syncTargets().map((c) => c.id);
    for (const r of this.view()) {
      const from = r.channels.find((c) => c.channel_id === src)?.price;
      if (from === null || from === undefined) continue;
      for (const t of targets) {
        if (r.channels.find((c) => c.channel_id === t)?.price !== from) {
          out.push({ recipe_id: r.recipe_id, channel_id: t, price: from });
        }
      }
    }
    return out;
  });

  constructor() {
    effect(() => {
      this.live.catalogVersion();
      untracked(() => this.load());
    });
    // Por defecto la plataforma de mayor prioridad (DiDi)
    effect(() => {
      const first = this.platforms()[0];
      if (first && !untracked(this.syncSource)) this.syncSource.set(first.id);
    });
  }

  /** Avisa al cerrar/recargar la pestaña si quedan cambios sin guardar */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: BeforeUnloadEvent): void {
    if (this.pendingCount()) e.preventDefault();
  }

  /** Guard de la ruta: pregunta antes de salir de la página con cambios sin guardar */
  async canLeave(): Promise<boolean> {
    if (!this.pendingCount()) return true;
    return this.ui.confirm({
      title: 'Cambios sin guardar',
      message: `Tienes ${this.pendingCount()} precio(s) sin guardar. Si sales se perderán.`,
      confirm: 'Salir sin guardar',
      danger: true,
    });
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const [r, checkpoint] = await Promise.all([this.api.pricing(), this.api.priceCheckpoint()]);
      this.checkpoint.set(checkpoint);
      this.rows.set(r.rows);
      this.channels.set(r.channels);
      this.settings.set(r.settings);
      // Quita pendientes que ya coinciden con lo guardado (p. ej. si se cambió en otra pestaña)
      const pending = new Map(this.pending());
      for (const k of [...pending.keys()]) {
        const [recipeId, channelId] = k.split(':').map(Number);
        if (pending.get(k) === this.saved(recipeId, channelId)) pending.delete(k);
      }
      if (pending.size !== this.pending().size) this.pending.set(pending);
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  cell(row: PricingRow, ch: Channel): PricingCell | undefined {
    return row.channels.find((c) => c.channel_id === ch.id);
  }

  /** Precio guardado en la base (sin cambios pendientes) */
  saved(recipeId: number, channelId: number): number | null {
    return (
      this.rows()
        .find((r) => r.recipe_id === recipeId)
        ?.channels.find((c) => c.channel_id === channelId)?.price ?? null
    );
  }

  isPending(row: PricingRow, ch: Channel): boolean {
    return this.pending().has(keyOf(row.recipe_id, ch.id));
  }

  /** Agrega cambios a la lista de pendientes; si un precio vuelve a su valor guardado deja de estar pendiente */
  private stage(changes: { recipe_id: number; channel_id: number; price: number | null }[]): void {
    const pending = new Map(this.pending());
    for (const c of changes) {
      const key = keyOf(c.recipe_id, c.channel_id);
      if (c.price === this.saved(c.recipe_id, c.channel_id)) pending.delete(key);
      else pending.set(key, c.price);
    }
    this.pending.set(pending);
  }

  private recalc(
    base: PricingCell,
    cost: number,
    price: number | null,
    ch: Channel,
    ivaRate: number,
  ): PricingCell {
    if (price === null) {
      return {
        ...base,
        price: null,
        commission: 0,
        iva: 0,
        isr: 0,
        profit: null,
        margin_pct: null,
        food_cost_pct: null,
        status: 'sin_precio',
      };
    }
    const b = breakdown(price, cost, ch, ivaRate);
    return {
      ...base,
      price,
      commission: b.commission,
      iva: b.iva,
      isr: b.isr,
      profit: Math.round(b.profit * 100) / 100,
      margin_pct: b.margin,
      food_cost_pct: price > 0 ? cost / price : null,
      status: b.profit < 0 ? 'perdida' : b.margin + 1e-9 < base.target_margin_pct ? 'bajo' : 'ok',
    };
  }

  setPrice(row: PricingRow, ch: Channel, value: string | number | null): void {
    const price = value === '' || value === null ? null : Number(value);
    if (price !== null && (Number.isNaN(price) || price < 0)) return;
    this.stage([{ recipe_id: row.recipe_id, channel_id: ch.id, price }]);
  }

  applyOne(row: PricingRow, ch: Channel): void {
    const suggested = this.cell(row, ch)?.suggested_price;
    if (suggested === null || suggested === undefined) return;
    this.stage([{ recipe_id: row.recipe_id, channel_id: ch.id, price: suggested }]);
  }

  applyChannel(ch: Channel, statuses: string[]): void {
    const changes = this.filtered()
      .map((r) => ({ r, c: this.cell(r, ch) }))
      .filter(({ c }) => c && statuses.includes(c.status) && c.suggested_price !== null)
      .map(({ r, c }) => ({
        recipe_id: r.recipe_id,
        channel_id: ch.id,
        price: c!.suggested_price,
      }));
    if (!changes.length) {
      this.ui.ok('No hay productos que ajustar');
      return;
    }
    this.stage(changes);
    this.ui.ok(`${changes.length} precio(s) en ${ch.name} listos. Revisa y presiona Guardar.`);
  }

  syncPrices(): void {
    const src = this.syncSourceChannel();
    const changes = this.syncDiff();
    if (!src || !changes.length) return;
    this.stage(changes);
    this.ui.ok(
      `${changes.length} precio(s) copiados de ${src.name} a ${this.syncTargetNames()}. Revisa y presiona Guardar.`,
    );
  }

  async saveAll(): Promise<void> {
    const changes = [...this.pending()].map(([k, price]) => {
      const [recipe_id, channel_id] = k.split(':').map(Number);
      return { recipe_id, channel_id, price };
    });
    if (!changes.length) return;
    const ok = await this.ui.confirm({
      title: 'Guardar precios',
      message: `Se guardarán ${changes.length} precio(s). Recuerda actualizarlos también en cada plataforma.`,
      confirm: 'Guardar',
    });
    if (!ok) return;
    this.saving.set(true);
    try {
      const r = await this.api.savePrices(changes);
      this.pending.set(new Map());
      this.ui.ok(`${r.changed} precio(s) guardados`);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.saving.set(false);
    }
  }

  /** Guarda (o reemplaza) la copia de los precios guardados en este momento */
  async saveCheckpoint(): Promise<void> {
    const cp = this.checkpoint();
    const notes = [
      cp ? `Reemplaza la copia del ${cp.created_at}; esa ya no se podrá recuperar.` : '',
      this.pendingCount()
        ? `Ojo: tienes ${this.pendingCount()} precio(s) sin guardar; la copia toma los precios guardados, no los pendientes.`
        : '',
    ].filter(Boolean);
    const ok = await this.ui.confirm({
      title: cp ? 'Reemplazar punto de control' : 'Guardar punto de control',
      message: `Se guardará una copia de los precios actuales de todos los productos y canales. ${notes.join(' ')}`,
      confirm: cp ? 'Reemplazar copia' : 'Guardar copia',
      danger: !!cp,
    });
    if (!ok) return;
    this.savingCheckpoint.set(true);
    try {
      this.checkpoint.set(await this.api.savePriceCheckpoint());
      this.ui.ok('Punto de control guardado');
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.savingCheckpoint.set(false);
    }
  }

  /** Pone los precios de la copia como cambios pendientes (se aplican al Guardar) */
  restoreCheckpoint(): void {
    const cp = this.checkpoint();
    const changes = this.checkpointDiff();
    if (!cp || !changes.length) return;
    this.stage(changes);
    this.ui.ok(
      `${changes.length} precio(s) regresados al punto de control del ${cp.created_at}. Revisa y presiona Guardar.`,
    );
  }

  async discard(): Promise<void> {
    const ok = await this.ui.confirm({
      title: 'Descartar cambios',
      message: `Se descartarán ${this.pendingCount()} precio(s) sin guardar.`,
      confirm: 'Descartar',
      danger: true,
    });
    if (ok) this.pending.set(new Map());
  }

  /** Deshace el cambio pendiente de una sola celda */
  revert(row: PricingRow, ch: Channel): void {
    this.stage([
      { recipe_id: row.recipe_id, channel_id: ch.id, price: this.saved(row.recipe_id, ch.id) },
    ]);
  }

  simulate(row: PricingRow, ch?: Channel): void {
    this.dialog
      .open(SimulatorDialog, {
        data: { row, channels: this.channels(), settings: this.settings(), channelId: ch?.id },
        width: '640px',
        maxWidth: '96vw',
      })
      .afterClosed()
      .subscribe((r?: { channel_id: number; price: number }) => {
        if (r) this.stage([{ recipe_id: row.recipe_id, channel_id: r.channel_id, price: r.price }]);
      });
  }

  norm(s: string): string {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
}
