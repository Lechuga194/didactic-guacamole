import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import {
  Channel,
  Promotion,
  PromotionAbsorber,
  PromotionType,
  RecipeListRow,
} from '../../core/models';

export const PROMO_TYPES: { value: PromotionType; label: string; valueLabel: string | null }[] = [
  { value: 'porcentaje', label: 'Porcentaje de descuento', valueLabel: '% de descuento' },
  { value: 'monto_fijo', label: 'Monto fijo de descuento', valueLabel: 'Pesos de descuento' },
  { value: '2x1', label: '2x1', valueLabel: null },
  { value: 'precio_especial', label: 'Precio especial', valueLabel: 'Precio final' },
  { value: 'producto_gratis', label: 'Producto gratis', valueLabel: null },
  { value: 'otro', label: 'Otra (monto manual)', valueLabel: null },
];

@Component({
  selector: 'app-promotion-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ promo ? 'Editar promoción' : 'Nueva promoción' }}</h2>
    <mat-dialog-content>
      <div class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="name" placeholder="Ej. 2x1 en molletes martes" />
        </mat-form-field>
        <div class="row">
          <mat-form-field appearance="outline" class="grow">
            <mat-label>Tipo</mat-label>
            <mat-select [ngModel]="type()" (ngModelChange)="type.set($event)">
              @for (t of types; track t.value) {
                <mat-option [value]="t.value">{{ t.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          @if (valueLabel()) {
            <mat-form-field appearance="outline">
              <mat-label>{{ valueLabel() }}</mat-label>
              <input matInput type="number" min="0" [(ngModel)]="value" />
            </mat-form-field>
          }
        </div>
        <div class="row">
          <span>¿Quién paga el descuento?</span>
          <mat-button-toggle-group [ngModel]="absorbed()" (ngModelChange)="absorbed.set($event)">
            <mat-button-toggle value="tienda">Yo</mat-button-toggle>
            <mat-button-toggle value="plataforma">La plataforma</mat-button-toggle>
            <mat-button-toggle value="compartido">Compartido</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        @if (absorbed() === 'compartido') {
          <div class="row">
            <span>Yo pago {{ share }}%</span>
            <mat-slider min="0" max="100" step="5" class="grow"
              ><input matSliderThumb [(ngModel)]="share"
            /></mat-slider>
          </div>
        }
        <div class="row">
          <mat-form-field appearance="outline" class="grow">
            <mat-label>Canal</mat-label>
            <mat-select [(ngModel)]="channelId">
              <mat-option [value]="null">Todos</mat-option>
              @for (c of data.channels; track c.id) {
                <mat-option [value]="c.id">{{ c.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Desde</mat-label>
            <input matInput type="date" [(ngModel)]="startsOn" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Hasta</mat-label>
            <input matInput type="date" [(ngModel)]="endsOn" />
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Productos incluidos (vacío = cualquiera)</mat-label>
          <mat-select multiple [(ngModel)]="recipeIds">
            @for (r of sellable(); track r.id) {
              <mat-option [value]="r.id">{{ r.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-slide-toggle [(ngModel)]="active">Activa</mat-slide-toggle>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      @if (promo) {
        <button mat-button class="danger" (click)="remove()">
          <mat-icon>delete</mat-icon> Eliminar
        </button>
      }
      <span class="spacer"></span>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="save()" [disabled]="!name.trim()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form {
      padding-top: 8px;
    }
    .row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .row > span,
    mat-button-toggle-group {
      margin-bottom: 8px;
    }
    .grow {
      flex: 1;
      min-width: 180px;
    }
    .danger {
      color: var(--critical-text);
    }
    .spacer {
      flex: 1;
    }
  `,
})
export class PromotionDialog {
  readonly data = inject<{ promo: Promotion | null; channels: Channel[] }>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<PromotionDialog>);
  private api = inject(ApiService);
  private ui = inject(UiService);
  readonly promo = this.data.promo;
  readonly types = PROMO_TYPES;

  name = this.promo?.name ?? '';
  readonly type = signal<PromotionType>(this.promo?.type ?? 'porcentaje');
  value = this.promo?.value ?? 0;
  readonly absorbed = signal<PromotionAbsorber>(this.promo?.absorbed_by ?? 'tienda');
  share = Math.round((this.promo?.store_share_pct ?? 0.5) * 100);
  channelId: number | null = this.promo?.channel_id ?? null;
  startsOn = this.promo?.starts_on ?? '';
  endsOn = this.promo?.ends_on ?? '';
  recipeIds: number[] = [...(this.promo?.recipe_ids ?? [])];
  active = (this.promo?.active ?? 1) === 1;
  readonly recipes = signal<RecipeListRow[]>([]);
  readonly sellable = computed(() =>
    this.recipes().filter((r) => r.kind !== 'preparacion' && r.active),
  );
  readonly valueLabel = computed(
    () => PROMO_TYPES.find((t) => t.value === this.type())?.valueLabel ?? null,
  );

  constructor() {
    this.api.recipes().then((r) => this.recipes.set(r.recipes));
  }

  async save(): Promise<void> {
    const absorbed = this.absorbed();
    try {
      await this.api.savePromotion(
        {
          name: this.name.trim(),
          type: this.type(),
          value: this.valueLabel() ? Number(this.value) || 0 : 0,
          absorbed_by: absorbed,
          store_share_pct:
            absorbed === 'tienda'
              ? 1
              : absorbed === 'plataforma'
                ? 0
                : (Number(this.share) || 0) / 100,
          channel_id: this.channelId,
          starts_on: this.startsOn || null,
          ends_on: this.endsOn || null,
          notes: null,
          active: this.active ? 1 : 0,
          recipe_ids: this.recipeIds,
        },
        this.promo?.id,
      );
      this.ui.ok('Promoción guardada');
      this.ref.close(true);
    } catch (err) {
      this.ui.error(err);
    }
  }

  async remove(): Promise<void> {
    if (!this.promo) return;
    const ok = await this.ui.confirm({
      title: 'Eliminar promoción',
      message: `¿Eliminar "${this.promo.name}"? Las ventas ya registradas conservan el descuento.`,
      confirm: 'Eliminar',
      danger: true,
    });
    if (!ok) return;
    try {
      await this.api.deletePromotion(this.promo.id);
      this.ref.close(true);
    } catch (err) {
      this.ui.error(err);
    }
  }
}
