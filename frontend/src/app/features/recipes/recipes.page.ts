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
import { RecipeKind, RecipeListRow } from '../../core/models';
import { MoneyPipe, OzHintPipe, QtyPipe, UnitCostPipe } from '../../core/format';

@Component({
  selector: 'app-recipes',
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
    MoneyPipe,
    QtyPipe,
    UnitCostPipe,
    OzHintPipe,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Recetas</h1>
          <div class="subtitle">
            Productos finales, preparaciones intermedias (salsas, jarabes, masas) y combos
          </div>
        </div>
        <span class="spacer"></span>
        <a mat-flat-button routerLink="/recetas/nueva" [queryParams]="{ tipo: kind() }"
          ><mat-icon>add</mat-icon> Nueva receta</a
        >
      </div>

      <div class="card filters">
        <mat-button-toggle-group [value]="kind()" (change)="kind.set($event.value)">
          <mat-button-toggle value="producto_final"
            >Productos finales ({{ count('producto_final') }})</mat-button-toggle
          >
          <mat-button-toggle value="preparacion"
            >Preparaciones ({{ count('preparacion') }})</mat-button-toggle
          >
          <mat-button-toggle value="combo">Combos ({{ count('combo') }})</mat-button-toggle>
        </mat-button-toggle-group>
        <mat-form-field appearance="outline" class="dense grow">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Buscar</mat-label>
          <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="dense">
          <mat-label>Categoría</mat-label>
          <mat-select [ngModel]="category()" (ngModelChange)="category.set($event)">
            <mat-option [value]="null">Todas</mat-option>
            @for (c of categories(); track c) {
              <mat-option [value]="c">{{ c }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="dense">
          <mat-label>Ordenar</mat-label>
          <mat-select [ngModel]="sort()" (ngModelChange)="sort.set($event)">
            <mat-option value="nombre">Nombre (A-Z)</mat-option>
            <mat-option value="antiguas">Revisión de precio: más antigua primero</mat-option>
            <mat-option value="recientes">Revisión de precio: más reciente primero</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="legend" aria-label="Escala de color de la revisión de precio">
          <span class="bar"></span>
          <span class="muted">revisado hoy → hace {{ staleDays }}+ días o nunca</span>
        </div>
      </div>

      @if (loading() && !rows().length) {
        <mat-progress-bar mode="indeterminate" />
      }

      <div class="card">
        <div class="table-wrap">
          <table class="simple">
            <thead>
              <tr>
                <th>Receta</th>
                <th>Precio revisado</th>
                <th>Categoría</th>
                <th class="num">Rinde</th>
                <th class="num">Costo total</th>
                <th class="num">Costo unitario</th>
                <th class="num">Empaque</th>
                <th class="num">Componentes</th>
              </tr>
            </thead>
            <tbody>
              @for (r of filtered(); track r.id) {
                <tr class="clickable" [class.cancelled]="!r.active" (click)="open(r.id)">
                  <td>
                    <strong>{{ r.name }}</strong>
                    @if (r.cost_error) {
                      <span class="status perdida" [matTooltip]="r.cost_error"
                        ><mat-icon>error</mat-icon> Error</span
                      >
                    }
                    @if (!r.active) {
                      <span class="status sin_precio">Inactiva</span>
                    }
                  </td>
                  <td class="reviewed">
                    <span
                      class="age-dot"
                      [style.background]="ageColor(r.price_reviewed_at)"
                      [matTooltip]="reviewTooltip(r.price_reviewed_at)"
                    ></span>
                    <span class="age-text" [class.muted]="!r.price_reviewed_at">{{
                      ageText(r.price_reviewed_at)
                    }}</span>
                    <button
                      mat-icon-button
                      class="check"
                      (click)="markReviewed(r, $event)"
                      matTooltip="Marcar precio como revisado ahora"
                      [attr.aria-label]="'Marcar precio de ' + r.name + ' como revisado'"
                    >
                      <mat-icon>task_alt</mat-icon>
                    </button>
                  </td>
                  <td class="muted">{{ r.category }}</td>
                  <td class="num" [matTooltip]="r.yield_qty | ozHint: r.yield_unit">{{ r.yield_qty | qty }} {{ r.yield_unit }}</td>
                  <td class="num">{{ r.cost_total | money }}</td>
                  <td class="num">
                    <strong>{{ r.cost_unit | unitCost }}</strong>
                    <span class="muted">/ {{ r.yield_unit }}</span>
                  </td>
                  <td class="num muted">
                    {{ r.packaging_unit ? (r.packaging_unit | money) : '' }}
                  </td>
                  <td class="num" [class.neg]="!r.items_count">{{ r.items_count }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="empty">Sin recetas</td>
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
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 0;
      mat-button-toggle-group {
        margin-bottom: 20px;
      }
      .grow {
        flex: 1;
        min-width: 200px;
      }
    }
    .legend {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font: var(--mat-sys-body-small);
      .bar {
        width: 70px;
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, hsl(120 65% 42%), hsl(60 80% 45%), hsl(0 70% 50%));
      }
    }
    .reviewed {
      white-space: nowrap;
      .age-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 6px;
        box-shadow: 0 0 0 2px var(--card-bg);
      }
      .age-text {
        display: inline-block;
        min-width: 86px;
        vertical-align: middle;
      }
      .check {
        --mat-icon-button-state-layer-size: 32px;
        width: 32px;
        height: 32px;
        padding: 4px;
        vertical-align: middle;
        color: var(--text-muted);
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
        &:hover {
          color: var(--good-text);
        }
      }
    }
  `,
})
export class RecipesPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private router = inject(Router);

  readonly rows = signal<RecipeListRow[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(false);
  readonly kind = signal<RecipeKind>('producto_final');
  readonly search = signal('');
  readonly category = signal<string | null>(null);
  readonly sort = signal<'nombre' | 'antiguas' | 'recientes'>('nombre');
  /** A partir de estos días la bolita queda en rojo */
  readonly staleDays = 30;

  readonly filtered = computed(() => {
    const term = this.norm(this.search());
    const list = this.rows().filter(
      (r) =>
        r.kind === this.kind() &&
        (!term || this.norm(r.name).includes(term)) &&
        (!this.category() || r.category === this.category()),
    );
    const sort = this.sort();
    if (sort === 'nombre') return list;
    // Nunca revisadas cuentan como las más antiguas
    const key = (r: RecipeListRow) => r.price_reviewed_at || '';
    return [...list].sort((a, b) =>
      sort === 'antiguas'
        ? key(a).localeCompare(key(b)) || a.name.localeCompare(b.name, 'es')
        : key(b).localeCompare(key(a)) || a.name.localeCompare(b.name, 'es'),
    );
  });

  // ---------- Revisión de precio ----------

  private daysSince(stamp: string | null): number | null {
    if (!stamp) return null;
    const t = new Date(stamp.replace(' ', 'T')).getTime();
    return Number.isNaN(t) ? null : Math.max(0, (Date.now() - t) / 86400000);
  }

  /** Verde (revisado hoy) → amarillo → rojo (hace `staleDays` días o más, o nunca). */
  ageColor(stamp: string | null): string {
    const days = this.daysSince(stamp);
    if (days === null) return 'hsl(0 70% 50%)';
    const f = Math.min(1, days / this.staleDays);
    return `hsl(${Math.round(120 * (1 - f))} ${Math.round(65 + 10 * f)}% ${Math.round(42 + 6 * f)}%)`;
  }

  ageText(stamp: string | null): string {
    const days = this.daysSince(stamp);
    if (days === null) return 'Nunca';
    const d = Math.floor(days);
    if (d === 0) return 'Hoy';
    if (d === 1) return 'Ayer';
    if (d < 60) return `Hace ${d} días`;
    return `Hace ${Math.floor(d / 30)} meses`;
  }

  reviewTooltip(stamp: string | null): string {
    if (!stamp) return 'Precio nunca revisado';
    const dt = new Date(stamp.replace(' ', 'T'));
    return `Última revisión: ${dt.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}`;
  }

  async markReviewed(r: RecipeListRow, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      const res = await this.api.markRecipeReviewed(r.id);
      this.rows.update((list) =>
        list.map((x) => (x.id === r.id ? { ...x, price_reviewed_at: res.price_reviewed_at } : x)),
      );
      this.ui.ok(`Precio de ${r.name} marcado como revisado`);
    } catch (err) {
      this.ui.error(err);
    }
  }

  constructor() {
    effect(() => {
      this.live.catalogVersion();
      untracked(() => this.load());
    });
  }

  count(kind: RecipeKind): number {
    return this.rows().filter((r) => r.kind === kind).length;
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const r = await this.api.recipes();
      this.rows.set(r.recipes);
      this.categories.set(r.categories);
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  open(id: number): void {
    this.router.navigate(['/recetas', id]);
  }

  norm(s: string): string {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
}
