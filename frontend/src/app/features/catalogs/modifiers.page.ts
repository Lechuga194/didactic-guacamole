import { Component, effect, inject, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/api.service';
import { LiveService } from '../../core/live.service';
import { UiService } from '../../core/ui.service';
import { ModifierGroup, RecipeListRow } from '../../core/models';
import { MoneyPipe } from '../../core/format';
import { ModifierDialog } from './modifier.dialog';

@Component({
  selector: 'app-modifiers',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, MoneyPipe],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Modificadores</h1>
          <div class="subtitle">
            Opciones que el cliente elige en la plataforma: tipo de proteína, salsa, extras,
            guarniciones…
          </div>
        </div>
        <span class="spacer"></span>
        <button mat-flat-button (click)="edit()"><mat-icon>add</mat-icon> Nuevo grupo</button>
      </div>

      <div class="card info">
        <mat-icon>lightbulb</mat-icon>
        <div>
          <strong>Dos tipos de grupo.</strong>
          "Define la variante" (p. ej. <em>Proteína</em>) ayuda a reconocer qué receta es en el
          ticket y su costo ya está en la receta. Los extras (p. ej. <em>Queso extra</em>) suman su
          propio costo: ligalos a un ingrediente o preparación con la cantidad que llevan.
        </div>
      </div>

      <div class="grid grid-3">
        @for (g of groups(); track g.id) {
          <div class="card group" (click)="edit(g)">
            <div class="card-title">
              {{ g.name }}
              <span class="spacer"></span>
              <span
                class="status"
                [class.ok]="g.defines_variant"
                [class.sin_precio]="!g.defines_variant"
              >
                {{ g.defines_variant ? 'Define la variante' : 'Extra / guarnición' }}
              </span>
            </div>
            <div class="opts">
              @for (o of g.options; track o.id) {
                <div class="opt" [class.off]="o.active === 0">
                  <span>{{ o.name }}</span>
                  <span class="spacer"></span>
                  @if (o.price_delta) {
                    <span>+{{ o.price_delta | money }}</span>
                  }
                  @if (o.cost) {
                    <span class="muted" matTooltip="Costo">({{ o.cost | money }})</span>
                  }
                </div>
              }
            </div>
            <div class="muted small">
              {{
                g.recipe_ids.length
                  ? 'En ' + g.recipe_ids.length + ' producto(s): ' + names(g.recipe_ids)
                  : 'Sin productos ligados'
              }}
            </div>
          </div>
        } @empty {
          <div class="card empty">Aún no hay grupos de modificadores</div>
        }
      </div>
    </div>
  `,
  styles: `
    .info {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      background: color-mix(in srgb, var(--viz-seq) 8%, var(--card-bg));
      mat-icon {
        color: var(--viz-seq);
      }
    }
    .group {
      cursor: pointer;
      &:hover {
        border-color: var(--mat-sys-primary);
      }
    }
    .opts {
      margin-bottom: 8px;
    }
    .opt {
      display: flex;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px solid var(--viz-grid);
      &.off {
        opacity: 0.45;
        text-decoration: line-through;
      }
    }
    .small {
      font: var(--mat-sys-body-small);
    }
  `,
})
export class ModifiersPage {
  private api = inject(ApiService);
  private live = inject(LiveService);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);
  readonly groups = signal<ModifierGroup[]>([]);
  readonly recipes = signal<RecipeListRow[]>([]);

  constructor() {
    effect(() => {
      this.live.catalogVersion();
      untracked(() => this.load());
    });
  }

  async load(): Promise<void> {
    try {
      const [groups, recipes] = await Promise.all([this.api.modifierGroups(), this.api.recipes()]);
      this.groups.set(groups);
      this.recipes.set(recipes.recipes);
    } catch (err) {
      this.ui.error(err);
    }
  }

  names(ids: number[]): string {
    const n = ids.map((id) => this.recipes().find((r) => r.id === id)?.name).filter(Boolean);
    return n.slice(0, 4).join(', ') + (n.length > 4 ? '…' : '');
  }

  edit(g?: ModifierGroup): void {
    this.dialog
      .open(ModifierDialog, { data: g ?? null, width: '760px', maxWidth: '96vw' })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) this.load();
      });
  }
}
