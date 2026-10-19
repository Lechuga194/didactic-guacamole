import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmData {
  title: string;
  message: string;
  confirm?: string;
  danger?: boolean;
  /** Lista opcional que se muestra debajo del mensaje (p. ej. recetas afectadas) */
  items?: string[];
  itemsIcon?: string;
  /** Nota final opcional */
  note?: string;
}

@Component({
  selector: 'app-confirm',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      @if (data.items?.length) {
        <ul class="items">
          @for (item of data.items; track $index) {
            <li>
              <mat-icon>{{ data.itemsIcon || 'menu_book' }}</mat-icon> {{ item }}
            </li>
          }
        </ul>
      }
      @if (data.note) {
        <p class="note">{{ data.note }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button [mat-dialog-close]="true" [class.danger]="data.danger">
        {{ data.confirm || 'Aceptar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .danger {
      --mat-button-filled-container-color: var(--critical);
      --mat-button-filled-label-text-color: #fff;
    }
    .items {
      list-style: none;
      padding: 8px 12px;
      margin: 0 0 8px;
      max-height: 220px;
      overflow: auto;
      border-radius: 10px;
      background: color-mix(in srgb, var(--text-muted) 10%, transparent);
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 3px 0;
      }
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-muted);
      }
    }
    .note {
      font: var(--mat-sys-body-small);
      color: var(--text-secondary);
    }
  `,
})
export class ConfirmDialog {
  data = inject<ConfirmData>(MAT_DIALOG_DATA);
}
