// Tipos espejo de la API (backend/src/interfaces)

export type PurchaseUnit = 'kg' | 'L' | 'pieza';
export type IngredientCategory = 'insumo' | 'empaque';
export type RecipeKind = 'preparacion' | 'producto_final' | 'combo';
export type YieldUnit = 'g' | 'ml' | 'pieza' | 'oz';

export interface Ingredient {
  id: number;
  code: string | null;
  name: string;
  category: IngredientCategory;
  purchase_unit: PurchaseUnit;
  purchase_cost: number;
  use_unit: 'g' | 'ml' | 'pieza';
  unit_cost: number;
  notes: string | null;
  active: number;
  price_volatile: number;
  needs_review: number;
  purchase_source: 'linea' | 'local';
  used_in: number;
  last_change_at: string | null;
  last_old_cost: number | null;
  updated_at: string;
}

export interface IngredientCostChange {
  id: number;
  old_cost: number | null;
  new_cost: number;
  changed_at: string;
}

export interface RecipeCost {
  total: number;
  unit: number;
  packaging_unit: number;
  error?: string;
}

export interface RecipeListRow {
  id: number;
  name: string;
  kind: RecipeKind;
  category: string | null;
  yield_qty: number;
  yield_unit: YieldUnit;
  notes: string | null;
  active: number;
  price_reviewed_at: string | null;
  cost_total: number;
  cost_unit: number;
  packaging_unit: number;
  items_count: number;
  cost_error?: string;
}

export interface RecipeItemDetail {
  id: number;
  ingredient_id: number | null;
  sub_recipe_id: number | null;
  quantity: number;
  notes: string | null;
  component_name: string;
  component_type: 'ingrediente' | 'receta';
  unit: string;
  unit_cost: number;
  subtotal: number;
  is_packaging: boolean;
}

export interface RecipeDetail {
  id: number;
  name: string;
  kind: RecipeKind;
  category: string | null;
  yield_qty: number;
  yield_unit: YieldUnit;
  notes: string | null;
  active: number;
  items: RecipeItemDetail[];
  cost: RecipeCost;
  prices: { channel_id: number; price: number }[];
  modifier_group_ids: number[];
  used_in: { id: number; name: string; kind: RecipeKind }[];
}

export interface RecipeInput {
  name: string;
  kind: RecipeKind;
  category: string | null;
  yield_qty: number;
  yield_unit: YieldUnit;
  notes: string | null;
  active: number;
  items: {
    ingredient_id: number | null;
    sub_recipe_id: number | null;
    quantity: number;
    notes: string | null;
  }[];
  modifier_group_ids: number[];
  prices: { channel_id: number; price: number }[];
}

export interface Channel {
  id: number;
  code: string;
  name: string;
  commission_pct: number;
  isr_ret_pct: number;
  iva_ret_pct: number;
  target_margin_pct: number | null;
  is_platform: number;
  color: string;
  sort_order: number;
  active: number;
}

export interface AppSettings {
  iva_rate: number;
  target_margin_pct: number;
  food_cost_target_pct: number;
  price_rounding: number;
  daily_sales_goal: number;
  daily_profit_goal: number;
  backup_keep: number;
  business_name: string;
  portal_url_didi: string;
  portal_url_uber: string;
  portal_url_rappi: string;
}

export type ExpenseFrequency = 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'anual';

export interface FixedExpense {
  id: number;
  name: string;
  category: string | null;
  amount: number;
  frequency: ExpenseFrequency;
  notes: string | null;
  active: number;
}

export interface ModifierOption {
  id?: number;
  group_id?: number;
  name: string;
  price_delta: number;
  ingredient_id: number | null;
  sub_recipe_id: number | null;
  quantity: number;
  fixed_cost: number;
  active?: number;
  cost?: number;
  component_name?: string | null;
}

export interface ModifierGroup {
  id: number;
  name: string;
  defines_variant: number;
  notes: string | null;
  options: ModifierOption[];
  recipe_ids: number[];
}

export type PromotionType =
  'porcentaje' | 'monto_fijo' | '2x1' | 'precio_especial' | 'producto_gratis' | 'otro';
export type PromotionAbsorber = 'tienda' | 'plataforma' | 'compartido';

export interface Promotion {
  id: number;
  name: string;
  type: PromotionType;
  value: number;
  absorbed_by: PromotionAbsorber;
  store_share_pct: number;
  channel_id: number | null;
  starts_on: string | null;
  ends_on: string | null;
  notes: string | null;
  active: number;
  recipe_ids: number[];
  times_used: number;
  store_cost: number;
}

// ---------- Pedidos ----------

export interface OrderModifierInput {
  modifier_option_id: number | null;
  group_name: string | null;
  name: string;
  quantity: number;
  price_delta: number;
  cost_delta?: number;
}

export interface OrderItemInput {
  id?: number;
  recipe_id: number | null;
  name: string;
  quantity: number;
  unit_price: number;
  modifiers: OrderModifierInput[];
  children?: OrderItemInput[];
}

export interface OrderPromotionInput {
  promotion_id: number | null;
  description: string;
  type: string;
  store_amount: number;
  platform_amount: number;
  item_indexes: number[];
}

export interface OrderInput {
  channel_id: number;
  ordered_at: string;
  external_ref: string | null;
  status: 'completado' | 'cancelado';
  source: 'manual' | 'ocr';
  notes: string | null;
  reported_payout: number | null;
  items: OrderItemInput[];
  promotions: OrderPromotionInput[];
  learn_aliases?: { alias_key: string; recipe_id: number }[];
}

export interface OrderTotals {
  gross_amount: number;
  discount_store: number;
  discount_platform: number;
  net_sale: number;
  iva_rate: number;
  iva_amount: number;
  commission_pct: number;
  commission_amount: number;
  commission_iva_amount: number;
  isr_ret_pct: number;
  isr_ret_amount: number;
  iva_ret_pct: number;
  iva_ret_amount: number;
  cost_amount: number;
  profit_amount: number;
  payout_amount: number;
}

export interface ComputedItem {
  recipe_id: number | null;
  name: string;
  quantity: number;
  line_total: number;
  unit_cost: number;
  line_cost: number;
  children: ComputedItem[];
}

export interface OrderPreview {
  items: ComputedItem[];
  totals: OrderTotals;
}

export interface Order extends OrderTotals {
  id: number;
  channel_id: number;
  ordered_at: string;
  external_ref: string | null;
  status: 'completado' | 'cancelado';
  source: 'manual' | 'ocr';
  reported_payout: number | null;
  notes: string | null;
  channel_name: string;
  channel_color: string;
}

export interface OrderListRow extends Order {
  items_summary: string;
  units: number;
}

export interface OrderModifierRow {
  id: number;
  modifier_option_id: number | null;
  group_name: string | null;
  name: string;
  quantity: number;
  price_delta: number;
  cost_delta: number;
}

export interface OrderItemDetail {
  id: number;
  recipe_id: number | null;
  name: string;
  quantity: number;
  unit_price: number;
  modifiers_price: number;
  line_total: number;
  recipe_cost: number;
  unit_cost: number;
  line_cost: number;
  modifiers: OrderModifierRow[];
  children: OrderItemDetail[];
}

export interface OrderDetail extends Order {
  items: OrderItemDetail[];
  promotions: {
    id: number;
    promotion_id: number | null;
    description: string;
    type: string;
    store_amount: number;
    platform_amount: number;
    order_item_ids: number[];
  }[];
}

export interface SellableProduct {
  id: number;
  name: string;
  kind: RecipeKind;
  category: string | null;
  cost: number;
  prices: Record<number, number>;
}

export interface OrderFormData {
  channels: Channel[];
  settings: AppSettings;
  products: SellableProduct[];
  modifier_groups: ModifierGroup[];
  promotions: Promotion[];
  favorites: { recipe_id: number; units: number }[];
}

// ---------- OCR ----------

export type MatchConfidence = 'alta' | 'media' | 'baja' | 'ninguna';

export interface DraftItem {
  raw_name: string;
  recipe_id: number | null;
  recipe_name: string | null;
  confidence: MatchConfidence;
  alias_key: string;
  name: string;
  quantity: number;
  unit_price: number;
  modifiers: OrderModifierInput[];
  children: DraftItem[];
  candidates: { recipe_id: number; name: string; score: number }[];
}

export interface OrderDraft {
  channel_id: number | null;
  channel_code: string | null;
  ordered_at: string | null;
  external_ref: string | null;
  items: DraftItem[];
  discount_store: number;
  subtotal: number | null;
  commission_amount: number | null;
  commission_pct: number | null;
  reported_payout: number | null;
  warnings: string[];
  raw_text: string;
}

// ---------- Reportes ----------

export interface Totals {
  orders: number;
  units: number;
  gross_amount: number;
  discount_store: number;
  net_sale: number;
  iva_amount: number;
  commission_amount: number;
  commission_iva_amount: number;
  isr_ret_amount: number;
  iva_ret_amount: number;
  cost_amount: number;
  profit_amount: number;
  payout_amount: number;
  avg_ticket: number;
  margin_pct: number;
}

export interface ChannelTotals extends Totals {
  channel_id: number;
  channel_name: string;
  color: string;
}

export interface ProductStat {
  recipe_id: number | null;
  name: string;
  category: string | null;
  units: number;
  sales: number;
  cost: number;
  profit: number;
  profit_per_unit: number;
  margin_pct: number;
}

export type MenuClass = 'estrella' | 'caballo' | 'enigma' | 'perro';

export interface MenuEngineeringRow extends ProductStat {
  popularity_pct: number;
  classification: MenuClass;
}

export interface DaySummary {
  date: string;
  totals: Totals;
  by_channel: ChannelTotals[];
  by_hour: { hour: number; orders: number; net_sale: number; profit: number }[];
  top_products: ProductStat[];
  goals: { sales: number; profit: number };
  orders: OrderListRow[];
  compare: { label: string; totals: Totals };
}

export interface Dashboard {
  from: string;
  to: string;
  totals: Totals;
  previous: Totals;
  by_channel: ChannelTotals[];
  daily: {
    date: string;
    orders: number;
    net_sale: number;
    profit: number;
    cost: number;
    commission: number;
  }[];
  by_category: { category: string; units: number; sales: number; profit: number }[];
  top_by_units: ProductStat[];
  top_by_profit: ProductStat[];
  worst_by_margin: ProductStat[];
  heatmap: { weekday: number; hour: number; orders: number; net_sale: number }[];
  menu: { rows: MenuEngineeringRow[]; popularity_threshold: number; margin_threshold: number };
  break_even: {
    monthly_fixed: number;
    daily_fixed: number;
    avg_profit_per_order: number;
    avg_ticket: number;
    orders_per_day_needed: number | null;
    sales_per_day_needed: number | null;
    days_in_range: number;
    avg_orders_per_day: number;
    net_after_fixed: number;
  };
  taxes: {
    iva_trasladado: number;
    iva_retenido: number;
    iva_acreditable_comisiones: number;
    iva_por_pagar: number;
    isr_retenido: number;
    base_sin_iva: number;
  };
  promotions: {
    description: string;
    times: number;
    store_amount: number;
    platform_amount: number;
  }[];
}

export interface PricingCell {
  channel_id: number;
  price: number | null;
  commission: number;
  iva: number;
  isr: number;
  profit: number | null;
  margin_pct: number | null;
  food_cost_pct: number | null;
  suggested_price: number | null;
  target_margin_pct: number;
  status: 'ok' | 'bajo' | 'perdida' | 'sin_precio';
  /** Bajo meta (o pérdida) pero aceptado a mano: no se destaca */
  accepted: boolean;
  /** Margen con el que se aceptó (null si no hay aceptación) */
  accepted_margin: number | null;
}

export interface PricingRow {
  recipe_id: number;
  name: string;
  kind: RecipeKind;
  category: string | null;
  cost_unit: number;
  packaging_unit: number;
  channels: PricingCell[];
}

/** Copia de todos los precios guardada como punto de control (price null = sin precio) */
export interface PriceCheckpoint {
  created_at: string;
  items: { recipe_id: number; channel_id: number; price: number | null }[];
}

export interface Alert {
  level: 'info' | 'warning' | 'danger';
  type: string;
  title: string;
  detail: string;
  link?: string;
  key: string;
  /** Oculta a mano o margen aceptado */
  hidden: boolean;
  /** Alertas de margen: producto y canales que se pueden aceptar / dejar de aceptar */
  recipe_id?: number;
  channel_ids?: number[];
}

export interface BackupInfo {
  file: string;
  size: number;
  created_at: string;
}
