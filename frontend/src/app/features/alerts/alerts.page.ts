import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { Alert } from '../../core/models';

const LEVEL = {
  danger: { icon: 'error', label: 'Urgente', cls: 'perdida' },
  warning: { icon: 'warning', label: 'Atención', cls: 'bajo' },
  info: { icon: 'info', label: 'Aviso', cls: 'sin_precio' },
};

@Component({
  selector: 'app-alerts',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Alertas</h1>
          <div class="subtitle">
            Productos que pierden dinero, alzas de costos y datos incompletos
          </div>
        </div>
        <span class="spacer"></span>
        <mat-button-toggle-group [value]="filter()" (change)="filter.set($event.value)">
          <mat-button-toggle value="all">Todas ({{ visible().length }})</mat-button-toggle>
          <mat-button-toggle value="danger">Urgentes ({{ count('danger') }})</mat-button-toggle>
          <mat-button-toggle value="warning">Atención ({{ count('warning') }})</mat-button-toggle>
          <mat-button-toggle value="info">Avisos ({{ count('info') }})</mat-button-toggle>
          <mat-button-toggle value="hidden">
            <mat-icon>visibility_off</mat-icon> Ocultas ({{ hidden().length }})
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (filter() === 'all' && visible().length > 1) {
        <div class="bulk">
          <button mat-button (click)="hideAll()">
            <mat-icon>visibility_off</mat-icon> Ocultar todas las que se ven
          </button>
        </div>
      }

      <div class="list">
        @for (a of filtered(); track a.key) {
          <div class="card alert" [class]="a.level" [class.is-hidden]="a.hidden">
            <span class="status" [class]="a.hidden ? 'aceptado' : level[a.level].cls"
              ><mat-icon>{{ a.hidden ? 'visibility_off' : level[a.level].icon }}</mat-icon>
              {{ a.hidden ? (a.recipe_id ? 'Aceptado' : 'Oculta') : level[a.level].label }}</span
            >
            <div class="body">
              <div class="title">{{ a.title }}</div>
              <div class="secondary">{{ a.detail }}</div>
            </div>
            @if (a.link) {
              <a mat-button [routerLink]="a.link"
                >Revisar <mat-icon iconPositionEnd>arrow_forward</mat-icon></a
              >
            }
            @if (a.recipe_id) {
              @if (a.hidden) {
                <button mat-stroked-button (click)="accept(a, false)">
                  <mat-icon>undo</mat-icon> Dejar de aceptar
                </button>
              } @else {
                <button
                  mat-stroked-button
                  (click)="accept(a, true)"
                  matTooltip="Este margen está bien así. Deja de alertar mientras el margen no baje más."
                >
                  <mat-icon>done</mat-icon> Aceptar margen
                </button>
              }
            } @else {
              @if (a.hidden) {
                <button mat-stroked-button (click)="hide(a, false)">
                  <mat-icon>visibility</mat-icon> Mostrar
                </button>
              } @else {
                <button
                  mat-stroked-button
                  (click)="hide(a, true)"
                  matTooltip="Ocultar. Vuelve a aparecer si su contenido cambia."
                >
                  <mat-icon>visibility_off</mat-icon> Ocultar
                </button>
              }
            }
          </div>
        } @empty {
          <div class="card empty">
            <mat-icon>verified</mat-icon>
            @if (filter() === 'hidden') {
              No hay alertas ocultas ni márgenes aceptados.
            } @else {
              Todo en orden. No hay alertas.
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .bulk {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .alert {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      padding: 14px 18px;
      border-left: 4px solid var(--text-muted);
      &.danger {
        border-left-color: var(--critical);
      }
      &.warning {
        border-left-color: var(--warning);
      }
      &.is-hidden {
        border-left-color: var(--text-muted);
        opacity: 0.8;
      }
    }
    .body {
      flex: 1;
      min-width: 220px;
    }
    .title {
      font: var(--mat-sys-title-small);
    }
  `,
})
export class AlertsPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  readonly alerts = signal<Alert[]>([]);
  readonly filter = signal<'all' | 'danger' | 'warning' | 'info' | 'hidden'>('all');
  readonly level = LEVEL;
  readonly visible = computed(() => this.alerts().filter((a) => !a.hidden));
  readonly hidden = computed(() => this.alerts().filter((a) => a.hidden));
  readonly filtered = computed(() => {
    const f = this.filter();
    if (f === 'hidden') return this.hidden();
    return f === 'all' ? this.visible() : this.visible().filter((a) => a.level === f);
  });

  constructor() {
    effect(() => {
      this.live.catalogVersion();
      untracked(() => this.load());
    });
  }

  count(level: string): number {
    return this.visible().filter((a) => a.level === level).length;
  }

  async load(): Promise<void> {
    try {
      this.alerts.set(await this.api.alerts());
    } catch (err) {
      this.ui.error(err);
    }
  }

  async hide(a: Alert, hidden: boolean): Promise<void> {
    try {
      await this.api.hideAlerts([a.key], hidden);
      this.ui.ok(hidden ? 'Alerta oculta' : 'Alerta visible de nuevo');
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  async accept(a: Alert, accepted: boolean): Promise<void> {
    if (!a.recipe_id || !a.channel_ids?.length) return;
    const recipeId = a.recipe_id;
    try {
      await this.api.acceptMargin(
        a.channel_ids.map((channel_id) => ({ recipe_id: recipeId, channel_id })),
        accepted,
      );
      this.ui.ok(accepted ? 'Margen aceptado' : 'El margen vuelve a alertar');
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  /** Oculta todas las alertas visibles: acepta los márgenes y oculta las demás */
  async hideAll(): Promise<void> {
    const list = this.visible();
    const ok = await this.ui.confirm({
      title: 'Ocultar todas las alertas',
      message: `Se ocultarán ${list.length} alerta(s). Los márgenes bajos quedan aceptados y volverán a alertar si bajan más; las demás reaparecen si su contenido cambia. Puedes verlas en "Ocultas".`,
      confirm: 'Ocultar todas',
    });
    if (!ok) return;
    try {
      const margins = list.flatMap((a) =>
        a.recipe_id
          ? (a.channel_ids || []).map((channel_id) => ({ recipe_id: a.recipe_id!, channel_id }))
          : [],
      );
      const keys = list.filter((a) => !a.recipe_id).map((a) => a.key);
      if (margins.length) await this.api.acceptMargin(margins, true);
      if (keys.length) await this.api.hideAlerts(keys, true);
      this.ui.ok(`${list.length} alerta(s) ocultas`);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }
}
