import {
  Component,
  HostListener,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import {
  Channel,
  DraftItem,
  ModifierGroup,
  ModifierOption,
  OrderDetail,
  OrderDraft,
  OrderFormData,
  OrderInput,
  OrderItemDetail,
  OrderItemInput,
  OrderModifierInput,
  OrderPreview,
  Promotion,
  SellableProduct,
} from '../../core/models';
import { MoneyPipe, PctPipe, toStamp } from '../../core/format';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';
import { seriesColor } from '../../shared/chart-theme';

interface OcrInfo {
  raw_name: string;
  confidence: string;
  alias_key: string;
  candidates: { recipe_id: number; name: string; score: number }[];
  original_recipe_id: number | null;
}

export interface Line {
  key: number;
  id?: number;
  recipe_id: number | null;
  name: string;
  quantity: number;
  unit_price: number;
  priceTouched: boolean;
  modifiers: OrderModifierInput[];
  children: Line[];
  ocr?: OcrInfo;
  showMods?: boolean;
}

interface PromoLine {
  key: number;
  promotion_id: number | null;
  description: string;
  type: string;
  store_amount: number;
  platform_amount: number;
  lineKeys: number[];
  manual: boolean;
}

let seq = 1;

@Component({
  selector: 'app-order-form',
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
    MatProgressBarModule,
    MatMenuModule,
    MatDividerModule,
    ChannelBadgeComponent,
    MoneyPipe,
    PctPipe,
  ],
  templateUrl: './order-form.page.html',
  styleUrl: './order-form.page.scss',
})
export class OrderFormPage implements OnDestroy {
  private api = inject(ApiService);
  readonly ui = inject(UiService);
  private router = inject(Router);

  /** Parámetros de ruta / query */
  readonly id = input<string>();
  readonly captura = input<string>();

  readonly orderId = computed(() => (this.id() ? Number(this.id()) : null));
  readonly data = signal<OrderFormData | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly scanning = signal(false);
  readonly dragOver = signal(false);

  // Encabezado del pedido
  readonly channelId = signal<number | null>(null);
  readonly date = signal('');
  readonly time = signal('');
  externalRef = '';
  notes = '';
  readonly status = signal<'completado' | 'cancelado'>('completado');
  readonly source = signal<'manual' | 'ocr'>('manual');
  readonly reportedPayout = signal<number | null>(null);

  // Detalle
  readonly lines = signal<Line[]>([]);
  readonly promos = signal<PromoLine[]>([]);
  readonly preview = signal<OrderPreview | null>(null);
  readonly draft = signal<OrderDraft | null>(null);
  readonly ticketUrl = signal<string | null>(null);
  readonly showTicket = signal(true);
  search = '';
  readonly searchTerm = signal('');

  readonly channels = computed(() => this.data()?.channels || []);
  readonly channel = computed<Channel | undefined>(() =>
    this.channels().find((c) => c.id === this.channelId()),
  );
  readonly productById = computed(
    () => new Map((this.data()?.products || []).map((p) => [p.id, p])),
  );
  readonly favorites = computed(() => {
    const d = this.data();
    if (!d) return [];
    const byId = this.productById();
    const fav = d.favorites
      .map((f) => byId.get(f.recipe_id))
      .filter((p): p is SellableProduct => !!p);
    if (fav.length >= 8) return fav.slice(0, 12);
    // Sin historial suficiente: completar con productos finales
    const rest = d.products.filter((p) => p.kind !== 'preparacion' && !fav.includes(p));
    return [...fav, ...rest].slice(0, 12);
  });
  readonly filtered = computed(() => {
    const term = this.normalize(this.searchTerm());
    const list = this.data()?.products || [];
    if (!term) return list.slice(0, 40);
    return list
      .filter(
        (p) =>
          this.normalize(p.name).includes(term) || this.normalize(p.category || '').includes(term),
      )
      .slice(0, 40);
  });
  readonly activePromos = computed<Promotion[]>(() => {
    const ch = this.channelId();
    return (this.data()?.promotions || []).filter((p) => !p.channel_id || p.channel_id === ch);
  });
  readonly itemCount = computed(() => this.lines().reduce((a, l) => a + l.quantity, 0));
  readonly totals = computed(() => this.preview()?.totals || null);
  readonly reviewCount = computed(
    () =>
      this.lines()
        .flatMap((l) => [l, ...l.children])
        .filter(
          (l) =>
            l.ocr &&
            (!l.recipe_id ||
              (l.ocr.confidence !== 'alta' && l.recipe_id === l.ocr.original_recipe_id)),
        ).length,
  );
  readonly canSave = computed(
    () => !!this.channelId() && this.lines().length > 0 && !this.saving(),
  );

  private previewTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const id = this.orderId();
      untracked(() => this.init(id));
    });
    // Recalcular utilidad cada vez que cambia algo (con pequeño retardo)
    effect(() => {
      this.lines();
      this.promos();
      this.channelId();
      this.date();
      this.time();
      untracked(() => this.schedulePreview());
    });
  }

  ngOnDestroy(): void {
    const url = this.ticketUrl();
    if (url) URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------- carga

  private async init(id: number | null): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.api.orderFormData();
      this.data.set(data);
      if (id) {
        this.fromOrder(await this.api.order(id));
      } else {
        this.reset(false);
        this.channelId.set(data.channels[0]?.id ?? null);
      }
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  reset(keepChannel = true): void {
    const now = new Date();
    const stamp = toStamp(now);
    this.date.set(stamp.slice(0, 10));
    this.time.set(stamp.slice(11));
    this.externalRef = '';
    this.notes = '';
    this.status.set('completado');
    this.source.set('manual');
    this.reportedPayout.set(null);
    this.lines.set([]);
    this.promos.set([]);
    this.draft.set(null);
    this.preview.set(null);
    const url = this.ticketUrl();
    if (url) URL.revokeObjectURL(url);
    this.ticketUrl.set(null);
    if (!keepChannel) this.channelId.set(null);
  }

  private fromOrder(o: OrderDetail): void {
    this.channelId.set(o.channel_id);
    this.date.set(o.ordered_at.slice(0, 10));
    this.time.set(o.ordered_at.slice(11, 16));
    this.externalRef = o.external_ref || '';
    this.notes = o.notes || '';
    this.status.set(o.status);
    this.source.set(o.source);
    this.reportedPayout.set(o.reported_payout);
    const toLine = (i: OrderItemDetail): Line => ({
      key: seq++,
      id: i.id,
      recipe_id: i.recipe_id,
      name: i.name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      priceTouched: true,
      modifiers: i.modifiers.map((m) => ({
        modifier_option_id: m.modifier_option_id,
        group_name: m.group_name,
        name: m.name,
        quantity: m.quantity,
        price_delta: m.price_delta,
        cost_delta: m.cost_delta,
      })),
      children: i.children.map(toLine),
    });
    const lines = o.items.map(toLine);
    this.lines.set(lines);
    const idToKey = new Map(lines.map((l) => [l.id, l.key]));
    this.promos.set(
      o.promotions.map((p) => ({
        key: seq++,
        promotion_id: p.promotion_id,
        description: p.description,
        type: p.type,
        store_amount: p.store_amount,
        platform_amount: p.platform_amount,
        lineKeys: p.order_item_ids.map((i) => idToKey.get(i)).filter((k): k is number => !!k),
        manual: true,
      })),
    );
  }

  // ---------------------------------------------------------------- canal y precios

  setChannel(id: number): void {
    this.channelId.set(id);
    for (const l of this.lines()) {
      if (!l.priceTouched && l.recipe_id) l.unit_price = this.priceFor(l.recipe_id);
    }
    this.touch();
  }

  priceFor(recipeId: number | null): number {
    if (!recipeId) return 0;
    const ch = this.channelId();
    const p = this.productById().get(recipeId);
    return (ch && p?.prices[ch]) || 0;
  }

  colorOf(c: Channel): string {
    return seriesColor(c.color, this.ui.dark());
  }

  // ---------------------------------------------------------------- líneas

  touch(): void {
    this.lines.set([...this.lines()]);
    this.recalcPromos();
  }

  addProduct(p: SellableProduct, parent?: Line): void {
    if (parent) {
      parent.children.push(this.newLine(p, 0));
      this.touch();
      return;
    }
    const existing = this.lines().find(
      (l) => l.recipe_id === p.id && !l.modifiers.length && !l.children.length && !l.ocr,
    );
    if (existing && p.kind !== 'combo') {
      existing.quantity += 1;
      this.touch();
      return;
    }
    const line = this.newLine(p, this.priceFor(p.id));
    if (p.kind === 'combo') line.showMods = true;
    this.lines.set([...this.lines(), line]);
    this.recalcPromos();
  }

  private newLine(p: SellableProduct, price: number): Line {
    return {
      key: seq++,
      recipe_id: p.id,
      name: p.name,
      quantity: 1,
      unit_price: price,
      priceTouched: false,
      modifiers: [],
      children: [],
    };
  }

  onSearchSelected(e: MatAutocompleteSelectedEvent): void {
    const p = e.option.value as SellableProduct;
    this.addProduct(p);
    this.search = '';
    this.searchTerm.set('');
  }

  addFirstMatch(): void {
    const first = this.filtered()[0];
    if (first && this.searchTerm()) {
      this.addProduct(first);
      this.search = '';
      this.searchTerm.set('');
    }
  }

  changeRecipe(line: Line, recipeId: number): void {
    const p = this.productById().get(recipeId);
    if (!p) return;
    line.recipe_id = p.id;
    line.name = p.name;
    if (!line.priceTouched) line.unit_price = this.priceFor(p.id);
    this.touch();
  }

  /** Crea al vuelo un combo con el nombre leído del ticket y lo asigna a la línea. */
  async createCombo(line: Line): Promise<void> {
    const name = (line.ocr?.raw_name.split(' + ')[0] || line.name).trim();
    const ch = this.channelId();
    try {
      const res = await this.api.saveRecipe({
        name,
        kind: 'combo',
        category: 'Combos',
        yield_qty: 1,
        yield_unit: 'pieza',
        notes: 'Creado desde la captura de un ticket',
        active: 1,
        items: [],
        modifier_group_ids: [],
        prices: ch ? [{ channel_id: ch, price: line.unit_price }] : [],
      });
      this.data.set(await this.api.orderFormData());
      line.recipe_id = res.id;
      line.name = name;
      if (line.ocr) line.ocr.original_recipe_id = res.id;
      this.touch();
      this.ui.ok(`Combo "${name}" creado. Su costo se toma de los productos que elijas dentro.`);
    } catch (err) {
      this.ui.error(err);
    }
  }

  qty(line: Line, delta: number): void {
    line.quantity = Math.max(1, (line.quantity || 1) + delta);
    this.touch();
  }

  removeLine(line: Line, parent?: Line): void {
    if (parent) parent.children = parent.children.filter((c) => c.key !== line.key);
    else this.lines.set(this.lines().filter((l) => l.key !== line.key));
    for (const p of this.promos()) p.lineKeys = p.lineKeys.filter((k) => k !== line.key);
    this.touch();
  }

  lineTotal(line: Line): number {
    const mods = line.modifiers.reduce((a, m) => a + (m.price_delta || 0) * (m.quantity || 1), 0);
    return (line.quantity || 0) * ((line.unit_price || 0) + mods);
  }

  isCombo(line: Line): boolean {
    return (
      this.productById().get(line.recipe_id || 0)?.kind === 'combo' || line.children.length > 0
    );
  }

  // ---------------------------------------------------------------- modificadores

  groupsFor(line: Line): ModifierGroup[] {
    const groups = this.data()?.modifier_groups || [];
    return groups.filter((g) => line.recipe_id && g.recipe_ids.includes(line.recipe_id));
  }

  otherGroups(line: Line): ModifierGroup[] {
    const linked = new Set(this.groupsFor(line).map((g) => g.id));
    return (this.data()?.modifier_groups || []).filter((g) => !linked.has(g.id));
  }

  activeOptions(group: ModifierGroup): ModifierOption[] {
    return group.options.filter((o) => o.active !== 0);
  }

  hasOption(line: Line, opt: ModifierOption): boolean {
    return line.modifiers.some((m) => m.modifier_option_id === opt.id);
  }

  toggleOption(line: Line, group: ModifierGroup, opt: ModifierOption): void {
    if (this.hasOption(line, opt)) {
      line.modifiers = line.modifiers.filter((m) => m.modifier_option_id !== opt.id);
    } else {
      if (group.defines_variant) {
        const ids = new Set(group.options.map((o) => o.id));
        line.modifiers = line.modifiers.filter((m) => !ids.has(m.modifier_option_id ?? -1));
      }
      line.modifiers = [
        ...line.modifiers,
        {
          modifier_option_id: opt.id ?? null,
          group_name: group.name,
          name: opt.name,
          quantity: 1,
          price_delta: opt.price_delta,
          cost_delta: opt.cost ?? 0,
        },
      ];
    }
    this.touch();
  }

  /** Modificadores que no pertenecen a los grupos enlazados (leídos del ticket o agregados a mano) */
  looseMods(line: Line): OrderModifierInput[] {
    const ids = new Set(this.groupsFor(line).flatMap((g) => g.options.map((o) => o.id)));
    return line.modifiers.filter((m) => !m.modifier_option_id || !ids.has(m.modifier_option_id));
  }

  removeMod(line: Line, mod: OrderModifierInput): void {
    line.modifiers = line.modifiers.filter((m) => m !== mod);
    this.touch();
  }

  addFreeMod(line: Line, name: string, price: string, cost: string): void {
    if (!name.trim()) return;
    line.modifiers = [
      ...line.modifiers,
      {
        modifier_option_id: null,
        group_name: 'Extra',
        name: name.trim(),
        quantity: 1,
        price_delta: Number(price) || 0,
        cost_delta: Number(cost) || 0,
      },
    ];
    this.touch();
  }

  addCatalogMod(line: Line, group: ModifierGroup, opt: ModifierOption): void {
    this.toggleOption(line, group, opt);
  }

  // ---------------------------------------------------------------- promociones

  addPromo(p?: Promotion): void {
    const promo: PromoLine = {
      key: seq++,
      promotion_id: p?.id ?? null,
      description: p?.name ?? 'Descuento',
      type: p?.type ?? 'otro',
      store_amount: 0,
      platform_amount: 0,
      lineKeys: p
        ? this.lines()
            .filter((l) => !p.recipe_ids.length || p.recipe_ids.includes(l.recipe_id || 0))
            .map((l) => l.key)
        : [],
      manual: !p,
    };
    this.promos.set([...this.promos(), promo]);
    this.recalcPromos();
  }

  removePromo(p: PromoLine): void {
    this.promos.set(this.promos().filter((x) => x.key !== p.key));
  }

  promoDef(p: PromoLine): Promotion | undefined {
    return this.data()?.promotions.find((x) => x.id === p.promotion_id);
  }

  /** Sugiere el monto de cada promoción según su tipo y los productos marcados. */
  recalcPromos(): void {
    let changed = false;
    for (const p of this.promos()) {
      const def = this.promoDef(p);
      if (!def || p.manual) continue;
      const lines = this.lines().filter((l) => p.lineKeys.includes(l.key));
      const base = lines.reduce((a, l) => a + this.lineTotal(l), 0);
      let total = 0;
      switch (def.type) {
        case 'porcentaje':
          total = (base * def.value) / 100;
          break;
        case 'monto_fijo':
          total = Math.min(def.value, base);
          break;
        case '2x1': {
          const units = lines.flatMap((l) =>
            Array(Math.max(1, Math.floor(l.quantity))).fill(this.lineTotal(l) / (l.quantity || 1)),
          );
          units.sort((a, b) => a - b);
          total = units.slice(0, Math.floor(units.length / 2)).reduce((a, v) => a + v, 0);
          break;
        }
        case 'precio_especial':
          total = Math.max(0, base - def.value);
          break;
        case 'producto_gratis':
          total = base;
          break;
        default:
          total = 0;
      }
      const share =
        def.absorbed_by === 'tienda'
          ? 1
          : def.absorbed_by === 'plataforma'
            ? 0
            : def.store_share_pct;
      const store = Math.round(total * share * 100) / 100;
      const platform = Math.round((total - store) * 100) / 100;
      if (store !== p.store_amount || platform !== p.platform_amount) {
        p.store_amount = store;
        p.platform_amount = platform;
        changed = true;
      }
    }
    if (changed) this.promos.set([...this.promos()]);
  }

  togglePromoLine(p: PromoLine, key: number): void {
    p.lineKeys = p.lineKeys.includes(key)
      ? p.lineKeys.filter((k) => k !== key)
      : [...p.lineKeys, key];
    this.promos.set([...this.promos()]);
    this.recalcPromos();
  }

  promoManual(p: PromoLine): void {
    p.manual = true;
    this.promos.set([...this.promos()]);
  }

  // ---------------------------------------------------------------- captura (OCR)

  @HostListener('window:paste', ['$event'])
  onPaste(e: ClipboardEvent): void {
    const file = Array.from(e.clipboardData?.files || []).find((f) => f.type.startsWith('image/'));
    if (file) {
      e.preventDefault();
      this.scan(file);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && this.canSave()) {
      e.preventDefault();
      this.save(false);
    }
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    const file = Array.from(e.dataTransfer?.files || []).find((f) => f.type.startsWith('image/'));
    if (file) this.scan(file);
    else this.ui.error(new Error('Suelta una imagen PNG o JPG'));
  }

  onFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.scan(file);
    input.value = '';
  }

  async scan(file: File): Promise<void> {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.ui.error(
        new Error('Formato no soportado: usa PNG o JPG (en Mac, las capturas ⌘⇧4 son PNG)'),
      );
      return;
    }
    this.scanning.set(true);
    try {
      const draft = await this.api.scanTicket(file);
      const old = this.ticketUrl();
      if (old) URL.revokeObjectURL(old);
      this.ticketUrl.set(URL.createObjectURL(file));
      this.showTicket.set(true);
      this.applyDraft(draft);
      const n = draft.items.length;
      this.ui.ok(
        n
          ? `Se leyeron ${n} producto(s). Revisa antes de guardar.`
          : 'No se reconocieron productos; captúralos a mano.',
      );
    } catch (err) {
      this.ui.error(err, 'No se pudo leer la captura');
    } finally {
      this.scanning.set(false);
    }
  }

  private applyDraft(d: OrderDraft): void {
    if (!this.orderId()) this.reset(true);
    this.draft.set(d);
    this.source.set('ocr');
    if (d.channel_id) this.channelId.set(d.channel_id);
    if (d.ordered_at) {
      this.date.set(d.ordered_at.slice(0, 10));
      this.time.set(d.ordered_at.slice(11, 16));
    }
    this.externalRef = d.external_ref || '';
    this.reportedPayout.set(d.reported_payout);
    const toLine = (i: DraftItem): Line => ({
      key: seq++,
      recipe_id: i.recipe_id,
      name: i.recipe_name || i.raw_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      priceTouched: true,
      modifiers: i.modifiers,
      children: i.children.map(toLine),
      showMods: false,
      ocr: {
        raw_name: [
          i.raw_name,
          ...i.modifiers.filter((m) => m.price_delta || i.modifiers.length < 3).map((m) => m.name),
        ].join(' + '),
        confidence: i.confidence,
        alias_key: i.alias_key,
        candidates: i.candidates,
        original_recipe_id: i.recipe_id,
      },
    });
    this.lines.set(d.items.map(toLine));
    if (d.discount_store > 0) {
      this.promos.set([
        {
          key: seq++,
          promotion_id: null,
          description: 'Promoción de tienda (del ticket)',
          type: 'otro',
          store_amount: d.discount_store,
          platform_amount: 0,
          lineKeys: [],
          manual: true,
        },
      ]);
    }
  }

  confidenceLabel(c: string): string {
    return (
      { alta: 'Reconocido', media: 'Revisar', baja: 'Revisar', ninguna: 'Elegir producto' }[c] || c
    );
  }

  // ---------------------------------------------------------------- cálculo y guardado

  private schedulePreview(): void {
    if (this.previewTimer) clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(() => this.runPreview(), 250);
  }

  private async runPreview(): Promise<void> {
    const payload = this.payload();
    if (!payload) {
      this.preview.set(null);
      return;
    }
    try {
      this.preview.set(await this.api.previewOrder(payload, this.orderId() ?? undefined));
    } catch {
      /* se mostrará el error al guardar */
    }
  }

  private toItem = (l: Line): OrderItemInput => ({
    ...(l.id ? { id: l.id } : {}),
    recipe_id: l.recipe_id,
    name: l.name || 'Producto',
    quantity: Number(l.quantity) || 1,
    unit_price: Number(l.unit_price) || 0,
    modifiers: l.modifiers.map((m) => ({
      modifier_option_id: m.modifier_option_id,
      group_name: m.group_name || null,
      name: m.name,
      quantity: m.quantity || 1,
      price_delta: Number(m.price_delta) || 0,
      ...(m.cost_delta !== undefined ? { cost_delta: Number(m.cost_delta) || 0 } : {}),
    })),
    children: l.children.map((c) => {
      const { children: _ignored, ...rest } = this.toItem(c);
      return rest;
    }),
  });

  payload(): OrderInput | null {
    const ch = this.channelId();
    if (!ch || !this.lines().length || !this.date() || !this.time()) return null;
    const lines = this.lines();
    const learn = lines
      .flatMap((l) => [l, ...l.children])
      .filter((l) => l.ocr && l.recipe_id)
      .map((l) => ({ alias_key: (l.ocr as OcrInfo).alias_key, recipe_id: l.recipe_id as number }));
    return {
      channel_id: ch,
      ordered_at: `${this.date()} ${this.time().slice(0, 5)}`,
      external_ref: this.externalRef.trim() || null,
      status: this.status(),
      source: this.source(),
      notes: this.notes.trim() || null,
      reported_payout: this.reportedPayout(),
      items: lines.map(this.toItem),
      promotions: this.promos()
        .filter((p) => p.store_amount > 0 || p.platform_amount > 0)
        .map((p) => ({
          promotion_id: p.promotion_id,
          description: p.description || 'Promoción',
          type: p.type,
          store_amount: Number(p.store_amount) || 0,
          platform_amount: Number(p.platform_amount) || 0,
          item_indexes: p.lineKeys
            .map((k) => lines.findIndex((l) => l.key === k))
            .filter((i) => i >= 0),
        })),
      learn_aliases: learn,
    };
  }

  async save(another: boolean): Promise<void> {
    const payload = this.payload();
    if (!payload) {
      this.ui.error(new Error('Elige el canal y agrega al menos un producto'));
      return;
    }
    const unmatched = this.lines()
      .flatMap((l) => [l, ...l.children])
      .filter((l) => !l.recipe_id);
    if (unmatched.length) {
      const ok = await this.ui.confirm({
        title: 'Productos sin receta',
        message: `${unmatched.map((l) => l.name).join(', ')} no está ligado a una receta, así que su costo será $0. ¿Guardar de todos modos?`,
        confirm: 'Guardar',
      });
      if (!ok) return;
    }
    this.saving.set(true);
    try {
      const id = this.orderId();
      await this.api.saveOrder(payload, id ?? undefined);
      const profit = this.totals()?.profit_amount ?? 0;
      this.ui.ok(
        `Venta ${id ? 'actualizada' : 'registrada'} · utilidad ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(profit)}`,
      );
      if (another && !id) {
        this.reset(true);
        this.api.orderFormData().then((d) => this.data.set(d));
      } else {
        this.router.navigate([id ? '/ventas' : '/hoy']);
      }
    } catch (err) {
      this.ui.error(err);
    } finally {
      this.saving.set(false);
    }
  }

  async remove(): Promise<void> {
    const id = this.orderId();
    if (!id) return;
    const ok = await this.ui.confirm({
      title: 'Eliminar venta',
      message: 'Se borrará el pedido y su detalle. No se puede deshacer.',
      confirm: 'Eliminar',
      danger: true,
    });
    if (!ok) return;
    try {
      await this.api.deleteOrder(id);
      this.ui.ok('Venta eliminada');
      this.router.navigate(['/ventas']);
    } catch (err) {
      this.ui.error(err);
    }
  }

  normalize(s: unknown): string {
    // El autocompletado puede entregar el objeto elegido en lugar del texto
    return (typeof s === 'string' ? s : '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }

  productLabel = (p: SellableProduct | null): string => (p ? p.name : '');
}
