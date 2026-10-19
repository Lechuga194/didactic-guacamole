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
import { MoneyPipe, QtyPipe, UnitCostPipe } from '../../core/format';

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
    UnitCostPipe
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Recetas</h1>
          <div class="subtitle">Productos finales, preparaciones intermedias (salsas, jarabes, masas) y combos</div>
        </div>
        <span class="spacer"></span>
        <a mat-flat-button routerLink="/recetas/nueva" [queryParams]="{ tipo: kind() }"><mat-icon>add</mat-icon> Nueva receta</a>
      </div>

      <div class="card filters">
        <mat-button-toggle-group [value]="kind()" (change)="kind.set($event.value)">
          <mat-button-toggle value="producto_final">Productos finales ({{ count('producto_final') }})</mat-button-toggle>
          <mat-button-toggle value="preparacion">Preparaciones ({{ count('preparacion') }})</mat-button-toggle>
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
                      <span class="status perdida" [matTooltip]="r.cost_error"><mat-icon>error</mat-icon> Error</span>
                    }
                    @if (!r.active) {
                      <span class="status sin_precio">Inactiva</span>
                    }
                  </td>
                  <td class="muted">{{ r.category }}</td>
                  <td class="num">{{ r.yield_qty | qty }} {{ r.yield_unit }}</td>
                  <td class="num">{{ r.cost_total | money }}</td>
                  <td class="num">
                    <strong>{{ r.cost_unit | unitCost }}</strong> <span class="muted">/ {{ r.yield_unit }}</span>
                  </td>
                  <td class="num muted">{{ r.packaging_unit ? (r.packaging_unit | money) : '' }}</td>
                  <td class="num" [class.neg]="!r.items_count">{{ r.items_count }}</td>
                </tr>
              } @empty {
                <tr><td colspan="7" class="empty">Sin recetas</td></tr>
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
  `
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

  readonly filtered = computed(() => {
    const term = this.norm(this.search());
    return this.rows().filter(
      (r) =>
        r.kind === this.kind() &&
        (!term || this.norm(r.name).includes(term)) &&
        (!this.category() || r.category === this.category())
    );
  });

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
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }
}
