import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import { Ingredient, ModifierGroup, ModifierOption, RecipeListRow } from '../../core/models';
import { MoneyPipe } from '../../core/format';

interface OptRow extends ModifierOption {
  source: 'ninguno' | 'ingrediente' | 'receta' | 'fijo';
}

@Component({
  selector: 'app-modifier-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MoneyPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar grupo' : 'Nuevo grupo de modificadores' }}</h2>
    <mat-dialog-content>
      <div class="row top">
        <mat-form-field appearance="outline" class="grow">
          <mat-label>Nombre del grupo (como aparece en la plataforma)</mat-label>
          <input matInput [(ngModel)]="name" />
        </mat-form-field>
        <mat-button-toggle-group [(ngModel)]="definesVariant">
          <mat-button-toggle [value]="1">Define la variante</mat-button-toggle>
          <mat-button-toggle [value]="0">Extra / guarnición</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <h3>Opciones</h3>
      @for (o of options(); track $index) {
        <div class="opt">
          <mat-form-field appearance="outline" class="dense name">
            <mat-label>Opción</mat-label>
            <input matInput [(ngModel)]="o.name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="dense money">
            <mat-label>Precio extra</mat-label>
            <span matTextPrefix>$&nbsp;</span>
            <input matInput type="number" [(ngModel)]="o.price_delta" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="dense src">
            <mat-label>Costo</mat-label>
            <mat-select [(ngModel)]="o.source">
              <mat-option value="ninguno">Sin costo</mat-option>
              <mat-option value="ingrediente">Ingrediente</mat-option>
              <mat-option value="receta">Preparación</mat-option>
              <mat-option value="fijo">Monto fijo</mat-option>
            </mat-select>
          </mat-form-field>
          @if (o.source === 'ingrediente') {
            <mat-form-field appearance="outline" class="dense comp">
              <mat-label>Ingrediente</mat-label>
              <mat-select [(ngModel)]="o.ingredient_id">
                @for (i of ingredients(); track i.id) {
                  <mat-option [value]="i.id">{{ i.name }} ({{ i.use_unit }})</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="dense qty">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" [(ngModel)]="o.quantity" />
            </mat-form-field>
          } @else if (o.source === 'receta') {
            <mat-form-field appearance="outline" class="dense comp">
              <mat-label>Preparación</mat-label>
              <mat-select [(ngModel)]="o.sub_recipe_id">
                @for (r of recipes(); track r.id) {
                  <mat-option [value]="r.id">{{ r.name }} ({{ r.yield_unit }})</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="dense qty">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" [(ngModel)]="o.quantity" />
            </mat-form-field>
          } @else if (o.source === 'fijo') {
            <mat-form-field appearance="outline" class="dense money">
              <mat-label>Costo</mat-label>
              <span matTextPrefix>$&nbsp;</span>
              <input matInput type="number" [(ngModel)]="o.fixed_cost" />
            </mat-form-field>
          }
          <span class="cost muted">{{ costOf(o) | money }}</span>
          <button mat-icon-button (click)="removeOption($index)" aria-label="Quitar opción"><mat-icon>close</mat-icon></button>
        </div>
      }
      <button mat-button (click)="addOption()"><mat-icon>add</mat-icon> Agregar opción</button>

      <h3>Productos que lo usan</h3>
      <mat-form-field appearance="outline" class="full">
        <mat-label>Productos</mat-label>
        <mat-select multiple [(ngModel)]="recipeIds">
          @for (r of sellable(); track r.id) {
            <mat-option [value]="r.id">{{ r.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      @if (data) {
        <button mat-button class="danger" (click)="remove()"><mat-icon>delete</mat-icon> Eliminar</button>
      }
      <span class="spacer"></span>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="save()" [disabled]="!name.trim()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .top {
      padding-top: 8px;
      mat-button-toggle-group {
        margin-bottom: 20px;
      }
    }
    .grow {
      flex: 1;
      min-width: 240px;
    }
    h3 {
      font: var(--mat-sys-title-small);
      margin: 8px 0;
    }
    .opt {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
      .name {
        width: 170px;
      }
      .money {
        width: 120px;
      }
      .src {
        width: 140px;
      }
      .comp {
        width: 190px;
      }
      .qty {
        width: 90px;
      }
      .cost {
        min-width: 60px;
        margin-bottom: 20px;
      }
      button {
        margin-bottom: 20px;
      }
    }
    .danger {
      color: var(--critical-text);
    }
    .spacer {
      flex: 1;
    }
  `
})
export class ModifierDialog {
  readonly data = inject<ModifierGroup | null>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<ModifierDialog>);
  private api = inject(ApiService);
  private ui = inject(UiService);

  name = this.data?.name ?? '';
  definesVariant = this.data?.defines_variant ?? 0;
  recipeIds: number[] = [...(this.data?.recipe_ids ?? [])];
  readonly options = signal<OptRow[]>(
    (this.data?.options ?? []).map((o) => ({
      ...o,
      source: o.ingredient_id ? 'ingrediente' : o.sub_recipe_id ? 'receta' : o.fixed_cost ? 'fijo' : 'ninguno'
    }))
  );
  readonly ingredients = signal<Ingredient[]>([]);
  readonly allRecipes = signal<RecipeListRow[]>([]);
  readonly recipes = computed(() => this.allRecipes().filter((r) => r.kind === 'preparacion'));
  readonly sellable = computed(() => this.allRecipes().filter((r) => r.kind !== 'preparacion'));

  constructor() {
    Promise.all([this.api.ingredients(), this.api.recipes()]).then(([i, r]) => {
      this.ingredients.set(i);
      this.allRecipes.set(r.recipes);
    });
    if (!this.data) this.addOption();
  }

  addOption(): void {
    this.options.set([
      ...this.options(),
      { name: '', price_delta: 0, ingredient_id: null, sub_recipe_id: null, quantity: 0, fixed_cost: 0, source: 'ninguno' }
    ]);
  }

  removeOption(idx: number): void {
    this.options.set(this.options().filter((_, i) => i !== idx));
  }

  costOf(o: OptRow): number {
    if (o.source === 'ingrediente') return (this.ingredients().find((i) => i.id === o.ingredient_id)?.unit_cost || 0) * (o.quantity || 0);
    if (o.source === 'receta') return (this.allRecipes().find((r) => r.id === o.sub_recipe_id)?.cost_unit || 0) * (o.quantity || 0);
    if (o.source === 'fijo') return o.fixed_cost || 0;
    return 0;
  }

  async save(): Promise<void> {
    const options = this.options()
      .filter((o) => o.name.trim())
      .map((o) => ({
        ...(o.id ? { id: o.id } : {}),
        name: o.name.trim(),
        price_delta: Number(o.price_delta) || 0,
        ingredient_id: o.source === 'ingrediente' ? o.ingredient_id : null,
        sub_recipe_id: o.source === 'receta' ? o.sub_recipe_id : null,
        quantity: o.source === 'ingrediente' || o.source === 'receta' ? Number(o.quantity) || 0 : 0,
        fixed_cost: o.source === 'fijo' ? Number(o.fixed_cost) || 0 : 0,
        active: 1
      }));
    try {
      await this.api.saveModifierGroup(
        { name: this.name.trim(), defines_variant: this.definesVariant, notes: null, options, recipe_ids: this.recipeIds },
        this.data?.id
      );
      this.ui.ok('Grupo guardado');
      this.ref.close(true);
    } catch (err) {
      this.ui.error(err);
    }
  }

  async remove(): Promise<void> {
    if (!this.data) return;
    const ok = await this.ui.confirm({ title: 'Eliminar grupo', message: `¿Eliminar "${this.data.name}"? Las ventas ya registradas conservan sus modificadores.`, confirm: 'Eliminar', danger: true });
    if (!ok) return;
    try {
      await this.api.deleteModifierGroup(this.data.id);
      this.ref.close(true);
    } catch (err) {
      this.ui.error(err);
    }
  }
}
