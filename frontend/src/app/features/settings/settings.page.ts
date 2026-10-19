import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import {
  AppSettings,
  BackupInfo,
  Channel,
  ExpenseFrequency,
  FixedExpense,
} from '../../core/models';
import { MoneyPipe, addDays, today } from '../../core/format';
import { CATEGORICAL } from '../../shared/chart-theme';

type Pct = 'commission_pct' | 'isr_ret_pct' | 'iva_ret_pct' | 'target_margin_pct';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    MoneyPipe,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  private api = inject(ApiService);
  readonly ui = inject(UiService);
  readonly tab = input<string>();

  readonly settings = signal<AppSettings | null>(null);
  readonly channels = signal<Channel[]>([]);
  readonly expenses = signal<FixedExpense[]>([]);
  readonly backups = signal<BackupInfo[]>([]);
  readonly palette = CATEGORICAL;
  exportFrom = addDays(today(), -29);
  exportTo = today();
  readonly frequencies: ExpenseFrequency[] = ['diario', 'semanal', 'quincenal', 'mensual', 'anual'];

  constructor() {
    this.load();
  }

  tabIndex(): number {
    return { canales: 1, gastos: 2, apariencia: 3, datos: 4 }[this.tab() || ''] ?? 0;
  }

  async load(): Promise<void> {
    try {
      const [s, b] = await Promise.all([this.api.settings(), this.api.backups()]);
      this.settings.set(s.settings);
      this.channels.set(s.channels.map((c) => ({ ...c })));
      this.expenses.set(s.expenses.map((e) => ({ ...e })));
      this.backups.set(b);
    } catch (err) {
      this.ui.error(err);
    }
  }

  // Porcentajes: se capturan como 35 y se guardan como 0.35
  pctOf(v: number | null): number | null {
    return v === null || v === undefined ? null : Math.round(v * 10000) / 100;
  }

  setPct(obj: Record<string, unknown>, key: string, v: string | number | null): void {
    obj[key] = v === '' || v === null ? null : Number(v) / 100;
  }

  async saveGeneral(): Promise<void> {
    const s = this.settings();
    if (!s) return;
    try {
      await this.api.saveSettings(s);
      this.ui.ok('Parámetros guardados. Precios sugeridos y márgenes recalculados.');
    } catch (err) {
      this.ui.error(err);
    }
  }

  addChannel(): void {
    const used = new Set(this.channels().map((c) => c.color));
    this.channels.set([
      ...this.channels(),
      {
        id: 0,
        code: '',
        name: '',
        commission_pct: 0.3,
        isr_ret_pct: 0.025,
        iva_ret_pct: 0.5,
        target_margin_pct: null,
        is_platform: 1,
        color: CATEGORICAL.find((c) => !used.has(c)) || CATEGORICAL[0],
        sort_order: this.channels().length + 1,
        active: 1,
      },
    ]);
  }

  async saveChannel(c: Channel): Promise<void> {
    const code =
      c.code ||
      c.name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .slice(0, 20);
    const { id, ...data } = { ...c, code };
    try {
      await this.api.saveChannel(data, id || undefined);
      this.ui.ok(`Canal ${c.name} guardado`);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  async deleteChannel(c: Channel): Promise<void> {
    if (!c.id) {
      this.channels.set(this.channels().filter((x) => x !== c));
      return;
    }
    const ok = await this.ui.confirm({
      title: 'Eliminar canal',
      message: `¿Eliminar ${c.name}?`,
      confirm: 'Eliminar',
      danger: true,
    });
    if (!ok) return;
    try {
      await this.api.deleteChannel(c.id);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  addExpense(): void {
    this.expenses.set([
      ...this.expenses(),
      { id: 0, name: '', category: null, amount: 0, frequency: 'mensual', notes: null, active: 1 },
    ]);
  }

  async saveExpense(e: FixedExpense): Promise<void> {
    if (!e.name.trim()) return;
    const { id, ...data } = e;
    try {
      await this.api.saveExpense({ ...data, amount: Number(data.amount) || 0 }, id || undefined);
      this.ui.ok('Gasto guardado');
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  async deleteExpense(e: FixedExpense): Promise<void> {
    if (!e.id) {
      this.expenses.set(this.expenses().filter((x) => x !== e));
      return;
    }
    try {
      await this.api.deleteExpense(e.id);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  monthly(): number {
    const f: Record<ExpenseFrequency, number> = {
      diario: 30,
      semanal: 52 / 12,
      quincenal: 2,
      mensual: 1,
      anual: 1 / 12,
    };
    return this.expenses()
      .filter((e) => e.active)
      .reduce((a, e) => a + (Number(e.amount) || 0) * f[e.frequency], 0);
  }

  async backup(): Promise<void> {
    try {
      this.backups.set(await this.api.createBackup());
      this.ui.ok('Respaldo creado');
    } catch (err) {
      this.ui.error(err);
    }
  }

  exportUrl(): string {
    return this.api.exportUrl(this.exportFrom, this.exportTo);
  }

  size(bytes: number): string {
    return bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  }
}
