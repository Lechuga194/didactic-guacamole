import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import { IngredientDeleteDialog } from './ingredient-delete.dialog';

/** Acciones de ingredientes compartidas entre la tabla y el diálogo de edición. */
@Injectable({ providedIn: 'root' })
export class IngredientActions {
  private api = inject(ApiService);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);

  /**
   * Si el ingrediente se usa en recetas abre el modal para quitarlo, cambiarlo por otro
   * o crear uno nuevo como reemplazo; si no, sólo pide confirmación. Devuelve true si se eliminó.
   */
  async delete(id: number, name: string): Promise<boolean> {
    try {
      const { ingredient, used_in } = await this.api.ingredient(id);
      const recipes = [...new Set(used_in.map((u) => u.name))];
      if (recipes.length) {
        const ref = this.dialog.open(IngredientDeleteDialog, {
          data: { ingredient, recipes },
          width: '600px',
          maxWidth: '96vw',
        });
        return !!(await firstValueFrom(ref.afterClosed()));
      }
      const ok = await this.ui.confirm({
        title: `Eliminar "${name}"`,
        message: 'No se usa en ninguna receta. ¿Eliminarlo?',
        confirm: 'Eliminar',
        danger: true,
      });
      if (!ok) return false;
      await this.api.deleteIngredient(id);
      this.ui.ok(`"${name}" eliminado`);
      return true;
    } catch (err) {
      this.ui.error(err);
      return false;
    }
  }
}
