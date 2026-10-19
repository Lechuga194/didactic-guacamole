import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule, MatIconModule],
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
          <mat-button-toggle value="all">Todas ({{ alerts().length }})</mat-button-toggle>
          <mat-button-toggle value="danger">Urgentes ({{ count('danger') }})</mat-button-toggle>
          <mat-button-toggle value="warning">Atención ({{ count('warning') }})</mat-button-toggle>
          <mat-button-toggle value="info">Avisos ({{ count('info') }})</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div class="list">
        @for (a of filtered(); track $index) {
          <div class="card alert" [class]="a.level">
            <span class="status" [class]="level[a.level].cls"
              ><mat-icon>{{ level[a.level].icon }}</mat-icon> {{ level[a.level].label }}</span
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
          </div>
        } @empty {
          <div class="card empty">
            <mat-icon>verified</mat-icon>
            Todo en orden. No hay alertas.
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .alert {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 18px;
      border-left: 4px solid var(--text-muted);
      &.danger {
        border-left-color: var(--critical);
      }
      &.warning {
        border-left-color: var(--warning);
      }
    }
    .body {
      flex: 1;
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
  readonly filter = signal<'all' | 'danger' | 'warning' | 'info'>('all');
  readonly level = LEVEL;
  readonly filtered = computed(() =>
    this.filter() === 'all'
      ? this.alerts()
      : this.alerts().filter((a) => a.level === this.filter()),
  );

  constructor() {
    effect(() => {
      this.live.catalogVersion();
      untracked(() => this.load());
    });
  }

  count(level: string): number {
    return this.alerts().filter((a) => a.level === level).length;
  }

  async load(): Promise<void> {
    try {
      this.alerts.set(await this.api.alerts());
    } catch (err) {
      this.ui.error(err);
    }
  }
}
