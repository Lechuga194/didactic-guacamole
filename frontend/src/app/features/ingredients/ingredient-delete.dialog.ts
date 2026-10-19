import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import { Ingredient, IngredientCategory, PurchaseUnit } from '../../core/models';
import { UnitCostPipe } from '../../core/format';

export interface IngredientDeleteData {
  ingredient: Ingredient;
  recipes: string[];
}

type Mode = 'quitar' | 'reemplazar' | 'nuevo';

const USE_UNIT: Record<PurchaseUnit, string> = { kg: 'g', L: 'ml', pieza: 'pieza' };

/**
 * Eliminar un ingrediente que se usa en recetas: quitarlo, reemplazarlo por otro
 * existente o crear uno nuevo al momento y usarlo como reemplazo.
 */
@Component({
  selector: 'app-ingredient-delete',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    UnitCostPipe,
  ],
  template: `
    <h2 mat-dialog-title>Eliminar "{{ ing.name }}"</h2>
    <mat-dialog-content>
      <p>Se usa en {{ data.recipes.length }} receta(s)/preparación(es):</p>
      <ul class="items">
        @for (r of data.recipes; track r) {
          <li><mat-icon>menu_book</mat-icon> {{ r }}</li>
        }
      </ul>

      <p class="q">¿Qué hacemos en esas recetas?</p>
      <mat-button-toggle-group
        [value]="mode()"
        (change)="mode.set($event.value)"
        class="modes"
        aria-label="Acción"
      >
        <mat-button-toggle value="reemplazar"
          ><mat-icon>swap_horiz</mat-icon> Cambiar por otro</mat-button-toggle
        >
        <mat-button-toggle value="nuevo"
          ><mat-icon>add_circle</mat-icon> Crear uno nuevo</mat-button-toggle
        >
        <mat-button-toggle value="quitar"
          ><mat-icon>remove_circle</mat-icon> Sólo quitarlo</mat-button-toggle
        >
      </mat-button-toggle-group>

      @if (mode() === 'reemplazar') {
        <mat-form-field appearance="outline" class="full">
          <mat-label>Ingrediente de reemplazo</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input
            matInput
            [(ngModel)]="search"
            (ngModelChange)="term.set($event)"
            [matAutocomplete]="auto"
            cdkFocusInitial
          />
          <mat-autocomplete
            #auto="matAutocomplete"
            [displayWith]="label"
            (optionSelected)="pick($event.option.value)"
          >
            @for (o of options(); track o.id) {
              <mat-option [value]="o">
                <div class="opt">
                  <span>{{ o.name }}</span>
                  <span class="muted">{{ o.unit_cost | unitCost }}/{{ o.use_unit }}</span>
                </div>
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
      }

      @if (mode() === 'nuevo') {
        <div class="new">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Nombre del nuevo ingrediente</mat-label>
            <input matInput [(ngModel)]="newName" (ngModelChange)="newNameSig.set($event)" />
          </mat-form-field>
          <div class="row">
            <mat-button-toggle-group
              [value]="newCategory()"
              (change)="newCategory.set($event.value)"
              aria-label="Tipo"
            >
              <mat-button-toggle value="insumo">Insumo</mat-button-toggle>
              <mat-button-toggle value="empaque">Empaque</mat-button-toggle>
            </mat-button-toggle-group>
          </div>
          <div class="row">
            <mat-form-field appearance="outline" class="cost">
              <mat-label>Costo de compra</mat-label>
              <span matTextPrefix>$&nbsp;</span>
              <input matInput type="number" min="0" [(ngModel)]="newCost" />
            </mat-form-field>
            <span class="muted">por</span>
            <mat-button-toggle-group
              [value]="newUnit()"
              (change)="newUnit.set($event.value)"
              aria-label="Unidad de compra"
            >
              <mat-button-toggle value="kg">kg</mat-button-toggle>
              <mat-button-toggle value="L">litro</mat-button-toggle>
              <mat-button-toggle value="pieza">pieza</mat-button-toggle>
            </mat-button-toggle-group>
          </div>
        </div>
      }

      @if (mode() !== 'quitar' && targetUnit()) {
        <div class="factor">
          <span
            >Cada <strong>1 {{ ing.use_unit }}</strong> de {{ ing.name }} se cambia por</span
          >
          <input
            class="factor-in"
            type="number"
            min="0.0001"
            step="any"
            [(ngModel)]="factor"
            aria-label="Cantidad equivalente"
          />
          <strong>{{ targetUnit() }}</strong>
          <span>de {{ targetName() }}</span>
        </div>
        @if (targetUnit() !== ing.use_unit) {
          <p class="warn">
            <mat-icon>warning</mat-icon>
            Las unidades son distintas ({{ ing.use_unit }} → {{ targetUnit() }}). Ajusta la
            equivalencia: por ejemplo, si 1 pieza pesa 150 g, escribe 150.
          </p>
        }
      }

      <p class="note">
        @switch (mode()) {
          @case ('quitar') {
            Se quitará de esas recetas y su costo bajará. Revisa que sigan completas.
          }
          @default {
            Las recetas conservarán la misma cantidad (× la equivalencia) con el nuevo ingrediente y
            se recalculará su costo.
          }
        }
        Las ventas ya registradas no cambian.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button class="danger" (click)="apply()" [disabled]="!canApply() || busy()">
        {{ applyLabel() }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .items {
      list-style: none;
      padding: 8px 12px;
      margin: 0 0 12px;
      max-height: 160px;
      overflow: auto;
      border-radius: 10px;
      background: color-mix(in srgb, var(--text-muted) 10%, transparent);
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 0;
      }
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-muted);
      }
    }
    .q {
      font: var(--mat-sys-title-small);
      margin: 4px 0 8px;
    }
    .modes {
      margin-bottom: 16px;
      flex-wrap: wrap;
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        vertical-align: -4px;
        margin-right: 4px;
      }
    }
    .full {
      width: 100%;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .cost {
      width: 170px;
    }
    .opt {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
    }
    .factor {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 10px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--viz-seq) 10%, transparent);
    }
    .factor-in {
      width: 90px;
      text-align: right;
      border: 1px solid var(--viz-axis);
      border-radius: 6px;
      padding: 4px 6px;
      font: var(--mat-sys-title-small);
      background: var(--card-bg);
      color: var(--text-primary);
    }
    .warn {
      display: flex;
      gap: 6px;
      align-items: flex-start;
      color: var(--text-secondary);
      font: var(--mat-sys-body-small);
      mat-icon {
        color: var(--serious);
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    .note {
      font: var(--mat-sys-body-small);
      color: var(--text-secondary);
      margin-top: 12px;
    }
    .danger {
      --mat-button-filled-container-color: var(--critical);
      --mat-button-filled-label-text-color: #fff;
    }
  `,
})
export class IngredientDeleteDialog {
  readonly data = inject<IngredientDeleteData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<IngredientDeleteDialog>);
  private api = inject(ApiService);
  private ui = inject(UiService);
  readonly ing = this.data.ingredient;

  readonly mode = signal<Mode>('reemplazar');
  readonly busy = signal(false);
  readonly all = signal<Ingredient[]>([]);
  // reemplazar
  search = '';
  readonly term = signal('');
  readonly picked = signal<Ingredient | null>(null);
  // nuevo
  newName = '';
  readonly newNameSig = signal('');
  readonly newCategory = signal<IngredientCategory>(this.ing.category);
  readonly newUnit = signal<PurchaseUnit>(this.ing.purchase_unit);
  newCost = this.ing.purchase_cost;
  factor = 1;

  readonly options = computed(() => {
    const t = this.norm(this.term());
    return this.all()
      .filter((i) => i.id !== this.ing.id && i.active && (!t || this.norm(i.name).includes(t)))
      .slice(0, 40);
  });
  readonly targetUnit = computed(() =>
    this.mode() === 'reemplazar'
      ? this.picked()?.use_unit || ''
      : this.mode() === 'nuevo'
        ? USE_UNIT[this.newUnit()]
        : '',
  );
  readonly targetName = computed(() =>
    this.mode() === 'reemplazar'
      ? this.picked()?.name || ''
      : this.newNameSig().trim() || 'el nuevo',
  );
  readonly canApply = computed(() => {
    if (this.mode() === 'quitar') return true;
    if (this.mode() === 'reemplazar') return !!this.picked();
    return !!this.newNameSig().trim();
  });
  readonly applyLabel = computed(() =>
    this.mode() === 'quitar'
      ? 'Quitar de las recetas y eliminar'
      : this.mode() === 'nuevo'
        ? 'Crear, reemplazar y eliminar'
        : 'Reemplazar y eliminar',
  );

  constructor() {
    this.api.ingredients().then((list) => this.all.set(list));
  }

  pick(i: Ingredient): void {
    this.picked.set(i);
    if (i.use_unit !== this.ing.use_unit) this.factor = 1;
  }

  label = (i: Ingredient | null): string => (i ? i.name : '');

  async apply(): Promise<void> {
    const factor = Number(this.factor);
    if (this.mode() !== 'quitar' && !(factor > 0)) {
      this.ui.error(new Error('La equivalencia debe ser mayor a 0'));
      return;
    }
    this.busy.set(true);
    try {
      if (this.mode() === 'quitar') {
        await this.api.deleteIngredient(this.ing.id, true);
        this.ui.ok(
          `"${this.ing.name}" eliminado y quitado de ${this.data.recipes.length} receta(s)`,
        );
      } else {
        let replacementId = this.picked()?.id;
        if (this.mode() === 'nuevo') {
          const created = await this.api.saveIngredient({
            name: this.newName.trim(),
            code: null,
            category: this.newCategory(),
            purchase_unit: this.newUnit(),
            purchase_cost: Number(this.newCost) || 0,
            notes: `Creado para reemplazar a "${this.ing.name}"`,
            active: 1,
          });
          replacementId = created.id;
        }
        const r = await this.api.replaceIngredient(this.ing.id, replacementId as number, factor);
        this.ui.ok(
          `"${this.ing.name}" reemplazado por "${r.replaced_with}" en ${r.recipes.length} receta(s) y eliminado`,
        );
      }
      this.ref.close(true);
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.busy.set(false);
    }
  }

  norm(s: unknown): string {
    // El autocompletado puede entregar el objeto elegido en lugar del texto
    return (typeof s === 'string' ? s : '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
}
