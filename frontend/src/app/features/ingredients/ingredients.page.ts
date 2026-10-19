import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { Ingredient } from '../../core/models';
import { MoneyPipe, PctPipe, UnitCostPipe } from '../../core/format';
import { IngredientDialog } from './ingredient.dialog';

@Component({
  selector: 'app-ingredients',
  imports: [
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressBarModule,
    MoneyPipe,
    PctPipe,
    UnitCostPipe
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Ingredientes e insumos</h1>
          <div class="subtitle">Cambia el costo de compra directamente en la tabla; todas las recetas y márgenes se recalculan solos.</div>
        </div>
        <span class="spacer"></span>
        <button mat-flat-button (click)="edit()"><mat-icon>add</mat-icon> Nuevo ingrediente</button>
      </div>

      <div class="card filters">
        <mat-form-field appearance="outline" class="dense grow">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Buscar</mat-label>
          <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)" />
        </mat-form-field>
        <mat-button-toggle-group [value]="category()" (change)="category.set($event.value)">
          <mat-button-toggle value="todos">Todos ({{ items().length }})</mat-button-toggle>
          <mat-button-toggle value="insumo">Insumos</mat-button-toggle>
          <mat-button-toggle value="empaque">Empaque y desechables</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (loading() && !items().length) {
        <mat-progress-bar mode="indeterminate" />
      }

      <div class="card">
        <div class="table-wrap">
          <table class="simple">
            <thead>
              <tr>
                <th>Código</th>
                <th>Ingrediente</th>
                <th>Tipo</th>
                <th class="num">Costo de compra</th>
                <th>Unidad</th>
                <th class="num">Costo por unidad de uso</th>
                <th class="num">Último cambio</th>
                <th class="num">Recetas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (i of filtered(); track i.id) {
                <tr [class.inactive]="!i.active">
                  <td class="muted">{{ i.code }}</td>
                  <td><button class="link" (click)="edit(i)">{{ i.name }}</button></td>
                  <td>
                    <span class="tag" [class.pack]="i.category === 'empaque'">{{ i.category === 'empaque' ? 'Empaque' : 'Insumo' }}</span>
                  </td>
                  <td class="num">
                    <span class="cur">$</span>
                    <input
                      class="cost-input"
                      type="number"
                      min="0"
                      step="0.5"
                      [value]="i.purchase_cost"
                      (change)="saveCost(i, $any($event.target).value)"
                      (keydown.enter)="$any($event.target).blur()"
                      [attr.aria-label]="'Costo de ' + i.name"
                    />
                  </td>
                  <td class="muted">por {{ i.purchase_unit }}</td>
                  <td class="num">{{ i.unit_cost | unitCost }} <span class="muted">/ {{ i.use_unit }}</span></td>
                  <td class="num">
                    @if (i.last_old_cost !== null && i.last_old_cost !== undefined && i.last_change_at) {
                      <span [class.neg]="i.purchase_cost > i.last_old_cost" [class.pos]="i.purchase_cost < i.last_old_cost" [matTooltip]="'Antes ' + (i.last_old_cost | money) + ' · ' + i.last_change_at">
                        {{ i.purchase_cost > i.last_old_cost ? '▲' : '▼' }} {{ change(i) | pct }}
                      </span>
                    }
                  </td>
                  <td class="num">{{ i.used_in }}</td>
                  <td class="num">
                    <button mat-icon-button (click)="edit(i)" aria-label="Editar"><mat-icon>edit</mat-icon></button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="9" class="empty">Sin resultados</td></tr>
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
      .grow {
        flex: 1;
        min-width: 220px;
      }
      mat-button-toggle-group {
        margin-bottom: 20px;
      }
    }
    .link {
      background: none;
      border: none;
      padding: 0;
      font: var(--mat-sys-body-large);
      color: var(--text-primary);
      cursor: pointer;
      text-align: left;
      &:hover {
        color: var(--mat-sys-primary);
        text-decoration: underline;
      }
    }
    .tag {
      font: var(--mat-sys-label-small);
      padding: 2px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--good) 14%, transparent);
      &.pack {
        background: color-mix(in srgb, var(--viz-seq) 14%, transparent);
      }
    }
    .cur {
      color: var(--text-muted);
    }
    .cost-input {
      width: 90px;
      text-align: right;
      border: 1px solid var(--viz-grid);
      border-radius: 6px;
      padding: 4px 6px;
      font: var(--mat-sys-title-small);
      background: var(--card-bg);
      color: var(--text-primary);
      &:focus {
        outline: none;
        border-color: var(--mat-sys-primary);
      }
    }
    tr.inactive td {
      opacity: 0.5;
    }
  `
})
export class IngredientsPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);

  readonly items = signal<Ingredient[]>([]);
  readonly loading = signal(false);
  readonly search = signal('');
  readonly category = signal<'todos' | 'insumo' | 'empaque'>('todos');

  readonly filtered = computed(() => {
    const term = this.norm(this.search());
    return this.items().filter(
      (i) =>
        (this.category() === 'todos' || i.category === this.category()) &&
        (!term || this.norm(i.name).includes(term) || this.norm(i.code || '').includes(term))
    );
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
      this.items.set(await this.api.ingredients());
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  change(i: Ingredient): number {
    return i.last_old_cost ? Math.abs(i.purchase_cost / i.last_old_cost - 1) : 0;
  }

  async saveCost(i: Ingredient, value: string): Promise<void> {
    const cost = Number(value);
    if (Number.isNaN(cost) || cost < 0 || cost === i.purchase_cost) return;
    try {
      await this.api.patchIngredient(i.id, { purchase_cost: cost });
      this.ui.ok(`${i.name}: $${cost} por ${i.purchase_unit}. Recetas recalculadas.`);
      await this.load();
    } catch (err) {
      this.ui.error(err);
    }
  }

  edit(i?: Ingredient): void {
    this.dialog
      .open(IngredientDialog, { data: i ?? null, width: '560px', maxWidth: '96vw' })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) this.load();
      });
  }

  norm(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }
}
