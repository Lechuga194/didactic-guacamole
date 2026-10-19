import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import { Ingredient, IngredientCostChange, PurchaseUnit } from '../../core/models';
import { MoneyPipe, OzHintPipe } from '../../core/format';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IngredientActions } from './ingredient-actions';

@Component({
  selector: 'app-ingredient-dialog',
  imports: [
    FormsModule,
    RouterLink,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MoneyPipe,
    OzHintPipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar ingrediente' : 'Nuevo ingrediente' }}</h2>
    <mat-dialog-content>
      <div class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="name" required cdkFocusInitial />
        </mat-form-field>
        <div class="row">
          <mat-button-toggle-group [(ngModel)]="category" aria-label="Tipo">
            <mat-button-toggle value="insumo">Insumo</mat-button-toggle>
            <mat-button-toggle value="empaque">Empaque / desechable</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Costo de compra</mat-label>
            <span matTextPrefix>$&nbsp;</span>
            <input
              matInput
              type="number"
              min="0"
              step="0.5"
              [ngModel]="cost()"
              (ngModelChange)="cost.set($event)"
              required
            />
          </mat-form-field>
          <span class="muted">por</span>
          <mat-button-toggle-group
            [ngModel]="unit()"
            (ngModelChange)="unit.set($event)"
            aria-label="Unidad de compra"
          >
            <mat-button-toggle value="kg">kg</mat-button-toggle>
            <mat-button-toggle value="L">litro</mat-button-toggle>
            <mat-button-toggle value="pieza">pieza</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        <div class="hint">
          En recetas se usa por <strong>{{ useUnit() }}</strong> a
          <strong>{{ unitCost() | money }}</strong> cada {{ useUnit() }}.
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Código</mat-label>
            <input matInput [(ngModel)]="code" placeholder="Automático" />
          </mat-form-field>
          <mat-slide-toggle [(ngModel)]="active">Activo</mat-slide-toggle>
        </div>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Notas (proveedor, presentación…)</mat-label>
          <textarea matInput rows="2" [(ngModel)]="notes"></textarea>
        </mat-form-field>
      </div>

      @if (history().length) {
        <h3>Historial de costo</h3>
        <table class="simple">
          <tbody>
            @for (h of history().slice(0, 8); track h.id) {
              <tr>
                <td class="muted">{{ h.changed_at }}</td>
                <td class="num">
                  {{ h.old_cost | money }} → <strong>{{ h.new_cost | money }}</strong>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
      @if (usedIn().length) {
        <h3>Se usa en</h3>
        <div class="used">
          @for (u of usedIn(); track u.id) {
            <a
              class="pill"
              [routerLink]="['/recetas', u.id]"
              mat-dialog-close
              [matTooltip]="u.quantity | ozHint: useUnit()"
              >{{ u.name }} · {{ u.quantity }} {{ useUnit() }}</a
            >
          }
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions>
      @if (data) {
        <button mat-button class="danger" (click)="remove()">
          <mat-icon>delete</mat-icon> Eliminar
        </button>
      }
      <span class="spacer"></span>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="save()" [disabled]="!name.trim() || saving()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form {
      padding-top: 8px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .hint {
      background: color-mix(in srgb, var(--viz-seq) 10%, transparent);
      border-radius: 8px;
      padding: 8px 12px;
      margin: -4px 0 16px;
    }
    h3 {
      font: var(--mat-sys-title-small);
      margin: 16px 0 8px;
    }
    .used {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .pill {
      font: var(--mat-sys-body-small);
      background: color-mix(in srgb, var(--text-muted) 14%, transparent);
      border-radius: 999px;
      padding: 3px 10px;
      color: var(--text-primary);
      text-decoration: none;
    }
    .danger {
      color: var(--critical-text);
    }
    .spacer {
      flex: 1;
    }
  `,
})
export class IngredientDialog {
  readonly data = inject<Ingredient | null>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<IngredientDialog>);
  private api = inject(ApiService);
  private ui = inject(UiService);
  private actions = inject(IngredientActions);

  name = this.data?.name ?? '';
  code = this.data?.code ?? '';
  category = this.data?.category ?? 'insumo';
  notes = this.data?.notes ?? '';
  active = (this.data?.active ?? 1) === 1;
  readonly cost = signal(this.data?.purchase_cost ?? 0);
  readonly unit = signal<PurchaseUnit>(this.data?.purchase_unit ?? 'kg');
  readonly useUnit = computed(() => ({ kg: 'g', L: 'ml', pieza: 'pieza' })[this.unit()]);
  readonly unitCost = computed(() =>
    this.unit() === 'pieza' ? Number(this.cost()) : Number(this.cost()) / 1000,
  );
  readonly history = signal<IngredientCostChange[]>([]);
  readonly usedIn = signal<{ id: number; name: string; quantity: number }[]>([]);
  readonly saving = signal(false);

  constructor() {
    if (this.data) {
      this.api.ingredient(this.data.id).then((r) => {
        this.history.set(r.history);
        this.usedIn.set(r.used_in);
      });
    }
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.api.saveIngredient(
        {
          name: this.name.trim(),
          code: this.code.trim() || null,
          category: this.category,
          purchase_unit: this.unit(),
          purchase_cost: Number(this.cost()) || 0,
          notes: this.notes.trim() || null,
          active: this.active ? 1 : 0,
        },
        this.data?.id,
      );
      this.ui.ok('Ingrediente guardado');
      this.ref.close(true);
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.saving.set(false);
    }
  }

  async remove(): Promise<void> {
    if (!this.data) return;
    if (await this.actions.delete(this.data.id, this.data.name)) this.ref.close(true);
  }
}
