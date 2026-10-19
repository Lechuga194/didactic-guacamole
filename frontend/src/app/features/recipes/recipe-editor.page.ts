import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import {
  AppSettings,
  Channel,
  Ingredient,
  ModifierGroup,
  RecipeDetail,
  RecipeKind,
  RecipeListRow,
  YieldUnit,
} from '../../core/models';
import { KIND_LABEL, MoneyPipe, OzHintPipe, PctPipe, UnitCostPipe } from '../../core/format';
import { breakdown, suggestedPrice } from '../../core/pricing';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';

interface Component_ {
  key: number;
  type: 'ingrediente' | 'receta';
  ref_id: number;
  quantity: number;
  notes: string;
}

interface Option {
  type: 'ingrediente' | 'receta';
  id: number;
  name: string;
  unit: string;
  unit_cost: number;
  hint: string;
}

let seq = 1;

@Component({
  selector: 'app-recipe-editor',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    ChannelBadgeComponent,
    MoneyPipe,
    PctPipe,
    UnitCostPipe,
    OzHintPipe,
  ],
  templateUrl: './recipe-editor.page.html',
  styleUrl: './recipe-editor.page.scss',
})
export class RecipeEditorPage {
  private api = inject(ApiService);
  private ui = inject(UiService);
  private router = inject(Router);

  readonly id = input<string>();
  readonly tipo = input<string>();
  readonly recipeId = computed(() => (this.id() ? Number(this.id()) : null));

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<RecipeListRow[]>([]);
  readonly categories = signal<string[]>([]);
  readonly channels = signal<Channel[]>([]);
  readonly settings = signal<AppSettings | null>(null);
  readonly groups = signal<ModifierGroup[]>([]);
  readonly detail = signal<RecipeDetail | null>(null);

  // formulario
  name = '';
  readonly kind = signal<RecipeKind>('producto_final');
  category = '';
  readonly yieldQty = signal(1);
  readonly yieldUnit = signal<YieldUnit>('pieza');
  notes = '';
  active = true;
  readonly items = signal<Component_[]>([]);
  readonly prices = signal<Record<number, number | null>>({});
  readonly groupIds = signal<number[]>([]);
  search = '';
  readonly searchTerm = signal('');
  readonly kindLabel = KIND_LABEL;

  readonly options = computed<Option[]>(() => {
    const self = this.recipeId();
    const ing: Option[] = this.ingredients()
      .filter((i) => i.active)
      .map((i) => ({
        type: 'ingrediente',
        id: i.id,
        name: i.name,
        unit: i.use_unit,
        unit_cost: i.unit_cost,
        hint: i.category === 'empaque' ? 'Empaque' : 'Ingrediente',
      }));
    const rec: Option[] = this.recipes()
      .filter((r) => r.id !== self && r.active)
      .map((r) => ({
        type: 'receta',
        id: r.id,
        name: r.name,
        unit: r.yield_unit,
        unit_cost: r.cost_unit,
        hint: KIND_LABEL[r.kind],
      }));
    return [
      ...rec.filter((r) => r.hint === 'Preparación'),
      ...ing,
      ...rec.filter((r) => r.hint !== 'Preparación'),
    ];
  });
  readonly filteredOptions = computed(() => {
    const t = this.norm(this.searchTerm());
    return (t ? this.options().filter((o) => this.norm(o.name).includes(t)) : this.options()).slice(
      0,
      50,
    );
  });

  readonly rows = computed(() =>
    this.items().map((it) => {
      const opt = this.options().find((o) => o.type === it.type && o.id === it.ref_id);
      const ing =
        it.type === 'ingrediente' ? this.ingredients().find((i) => i.id === it.ref_id) : undefined;
      const unitCost = opt?.unit_cost ?? 0;
      return {
        ...it,
        name: opt?.name ?? '¿?',
        unit: opt?.unit ?? '',
        hint: opt?.hint ?? '',
        unit_cost: unitCost,
        subtotal: unitCost * (Number(it.quantity) || 0),
        packaging: ing?.category === 'empaque',
      };
    }),
  );
  readonly total = computed(() => this.rows().reduce((a, r) => a + r.subtotal, 0));
  readonly packaging = computed(() =>
    this.rows().reduce((a, r) => a + (r.packaging ? r.subtotal : 0), 0),
  );
  readonly unitCost = computed(() => this.total() / (Number(this.yieldQty()) || 1));
  readonly sellable = computed(() => this.kind() !== 'preparacion');

  readonly priceRows = computed(() => {
    const s = this.settings();
    if (!s) return [];
    return this.channels().map((ch) => {
      const price = this.prices()[ch.id] ?? null;
      const target = ch.target_margin_pct ?? s.target_margin_pct;
      const b = price !== null ? breakdown(price, this.unitCost(), ch, s.iva_rate) : null;
      return {
        ch,
        price,
        profit: b?.profit ?? null,
        margin: b?.margin ?? null,
        suggested: suggestedPrice(this.unitCost(), ch, s.iva_rate, target, s.price_rounding),
        target,
      };
    });
  });

  constructor() {
    effect(() => {
      const id = this.recipeId();
      untracked(() => this.load(id));
    });
  }

  async load(id: number | null): Promise<void> {
    this.loading.set(true);
    try {
      const [ings, recs, settings, groups] = await Promise.all([
        this.api.ingredients(),
        this.api.recipes(),
        this.api.settings(),
        this.api.modifierGroups(),
      ]);
      this.ingredients.set(ings);
      this.recipes.set(recs.recipes);
      this.categories.set(recs.categories);
      this.channels.set(settings.channels.filter((c) => c.active));
      this.settings.set(settings.settings);
      this.groups.set(groups);
      if (id) {
        const d = await this.api.recipe(id);
        this.detail.set(d);
        this.name = d.name;
        this.kind.set(d.kind);
        this.category = d.category || '';
        this.yieldQty.set(d.yield_qty);
        this.yieldUnit.set(d.yield_unit);
        this.notes = d.notes || '';
        this.active = d.active === 1;
        this.items.set(
          d.items.map((i) => ({
            key: seq++,
            type: i.ingredient_id ? 'ingrediente' : 'receta',
            ref_id: (i.ingredient_id || i.sub_recipe_id) as number,
            quantity: i.quantity,
            notes: i.notes || '',
          })),
        );
        this.prices.set(Object.fromEntries(d.prices.map((p) => [p.channel_id, p.price])));
        this.groupIds.set(d.modifier_group_ids);
      } else {
        const k = (this.tipo() as RecipeKind) || 'producto_final';
        this.kind.set(
          ['preparacion', 'producto_final', 'combo'].includes(k) ? k : 'producto_final',
        );
        this.yieldUnit.set(k === 'preparacion' ? 'g' : 'pieza');
        this.yieldQty.set(k === 'preparacion' ? 1000 : 1);
      }
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  addOption(e: MatAutocompleteSelectedEvent): void {
    const o = e.option.value as Option;
    this.items.set([
      ...this.items(),
      { key: seq++, type: o.type, ref_id: o.id, quantity: o.unit === 'pieza' ? 1 : 0, notes: '' },
    ]);
    this.search = '';
    this.searchTerm.set('');
    setTimeout(() =>
      (document.querySelector('.qty-in:last-of-type') as HTMLInputElement | null)?.focus(),
    );
  }

  setQty(key: number, value: number): void {
    this.items.set(this.items().map((i) => (i.key === key ? { ...i, quantity: value } : i)));
  }

  remove(key: number): void {
    this.items.set(this.items().filter((i) => i.key !== key));
  }

  move(key: number, dir: -1 | 1): void {
    const list = [...this.items()];
    const idx = list.findIndex((i) => i.key === key);
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];
    this.items.set(list);
  }

  setPrice(channelId: number, value: string | number | null): void {
    const price = value === '' || value === null ? null : Number(value);
    this.prices.set({ ...this.prices(), [channelId]: price });
  }

  toggleGroup(id: number): void {
    const ids = this.groupIds();
    this.groupIds.set(ids.includes(id) ? ids.filter((g) => g !== id) : [...ids, id]);
  }

  async save(): Promise<void> {
    if (!this.name.trim()) {
      this.ui.error(new Error('Escribe el nombre de la receta'));
      return;
    }
    const bad = this.items().filter((i) => !(Number(i.quantity) > 0));
    if (bad.length) {
      this.ui.error(new Error('Todas las cantidades deben ser mayores a 0'));
      return;
    }
    this.saving.set(true);
    try {
      const res = await this.api.saveRecipe(
        {
          name: this.name.trim(),
          kind: this.kind(),
          category:
            this.category.trim() || (this.kind() === 'preparacion' ? 'Preparaciones' : null),
          yield_qty: Number(this.yieldQty()) || 1,
          yield_unit: this.yieldUnit(),
          notes: this.notes.trim() || null,
          active: this.active ? 1 : 0,
          items: this.items().map((i) => ({
            ingredient_id: i.type === 'ingrediente' ? i.ref_id : null,
            sub_recipe_id: i.type === 'receta' ? i.ref_id : null,
            quantity: Number(i.quantity),
            notes: i.notes || null,
          })),
          modifier_group_ids: this.groupIds(),
          prices: this.sellable()
            ? Object.entries(this.prices())
                .filter(([, p]) => p !== null && p !== undefined && !Number.isNaN(p))
                .map(([ch, p]) => ({ channel_id: Number(ch), price: Number(p) }))
            : [],
        },
        this.recipeId() ?? undefined,
      );
      this.ui.ok('Receta guardada');
      if (!this.recipeId()) this.router.navigate(['/recetas', res.id]);
      else this.load(res.id);
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.saving.set(false);
    }
  }

  async duplicate(): Promise<void> {
    const id = this.recipeId();
    if (!id) return;
    const name = prompt('Nombre de la copia', `${this.name} (copia)`);
    if (!name?.trim()) return;
    try {
      const r = await this.api.duplicateRecipe(id, name.trim());
      this.ui.ok('Receta duplicada');
      this.router.navigate(['/recetas', r.id]);
    } catch (err) {
      this.ui.error(err);
    }
  }

  async remove_(): Promise<void> {
    const id = this.recipeId();
    if (!id) return;
    const ok = await this.ui.confirm({
      title: 'Eliminar receta',
      message: `¿Eliminar "${this.name}"? Si ya tiene ventas registradas sólo se desactivará para conservar el historial.`,
      confirm: 'Eliminar',
      danger: true,
    });
    if (!ok) return;
    try {
      const r = await this.api.deleteRecipe(id);
      this.ui.ok(r.deactivated ? 'Tenía ventas: se desactivó' : 'Receta eliminada');
      this.router.navigate(['/recetas']);
    } catch (err) {
      this.ui.error(err);
    }
  }

  norm(s: unknown): string {
    // El autocompletado puede entregar el objeto elegido en lugar del texto
    return (typeof s === 'string' ? s : '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  optionLabel = (o: Option | null) => (o ? o.name : '');
}
