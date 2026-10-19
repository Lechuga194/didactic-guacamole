import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Alert,
  AppSettings,
  BackupInfo,
  Channel,
  Dashboard,
  DaySummary,
  FixedExpense,
  Ingredient,
  IngredientCostChange,
  ModifierGroup,
  OrderDetail,
  OrderDraft,
  OrderFormData,
  OrderInput,
  OrderListRow,
  OrderPreview,
  PricingRow,
  Promotion,
  RecipeDetail,
  RecipeInput,
  RecipeListRow
} from './models';

type Params = Record<string, string | number | boolean | null | undefined>;

/** Cliente de la API. Todas las llamadas devuelven promesas para usarlas con async/await. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api';

  private params(p: Params = {}): HttpParams {
    let hp = new HttpParams();
    for (const [k, v] of Object.entries(p)) if (v !== null && v !== undefined && v !== '') hp = hp.set(k, String(v));
    return hp;
  }

  get<T>(url: string, params?: Params): Promise<T> {
    return firstValueFrom(this.http.get<T>(this.base + url, { params: this.params(params) }));
  }
  post<T>(url: string, body: unknown, params?: Params): Promise<T> {
    return firstValueFrom(this.http.post<T>(this.base + url, body, { params: this.params(params) }));
  }
  put<T>(url: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.put<T>(this.base + url, body));
  }
  patch<T>(url: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.patch<T>(this.base + url, body));
  }
  delete<T>(url: string): Promise<T> {
    return firstValueFrom(this.http.delete<T>(this.base + url));
  }

  // Ingredientes
  ingredients = () => this.get<{ ingredients: Ingredient[] }>('/ingredients').then((r) => r.ingredients);
  ingredient = (id: number) =>
    this.get<{ ingredient: Ingredient; history: IngredientCostChange[]; used_in: { id: number; name: string; quantity: number }[] }>(
      `/ingredients/${id}`
    );
  saveIngredient = (data: Partial<Ingredient>, id?: number) =>
    id ? this.put<{ id: number }>(`/ingredients/${id}`, data) : this.post<{ id: number }>('/ingredients', data);
  patchIngredient = (id: number, data: Partial<Ingredient>) => this.patch<{ id: number }>(`/ingredients/${id}`, data);
  bulkCosts = (changes: { id: number; purchase_cost: number }[]) =>
    this.put<{ updated: number }>('/ingredients/bulk-costs', { changes });
  deleteIngredient = (id: number) => this.delete(`/ingredients/${id}`);

  // Recetas
  recipes = () => this.get<{ recipes: RecipeListRow[]; categories: string[] }>('/recipes');
  recipe = (id: number) => this.get<{ recipe: RecipeDetail }>(`/recipes/${id}`).then((r) => r.recipe);
  saveRecipe = (data: RecipeInput, id?: number) =>
    id ? this.put<{ id: number }>(`/recipes/${id}`, data) : this.post<{ id: number }>('/recipes', data);
  duplicateRecipe = (id: number, name: string) => this.post<{ id: number }>(`/recipes/${id}/duplicate`, { name });
  setRecipeActive = (id: number, active: number) => this.patch(`/recipes/${id}/active`, { active });
  deleteRecipe = (id: number) => this.delete<{ deleted?: boolean; deactivated?: boolean }>(`/recipes/${id}`);

  // Precios
  pricing = () => this.get<{ rows: PricingRow[]; channels: Channel[]; settings: AppSettings }>('/pricing');
  setPrice = (recipe_id: number, channel_id: number, price: number | null) =>
    this.put('/pricing/price', { recipe_id, channel_id, price });
  applySuggested = (targets: { recipe_id: number; channel_id: number }[]) =>
    this.post<{ changed: number }>('/pricing/apply-suggested', { targets });

  // Modificadores y promociones
  modifierGroups = () => this.get<{ groups: ModifierGroup[] }>('/modifiers').then((r) => r.groups);
  saveModifierGroup = (data: unknown, id?: number) =>
    id ? this.put<{ id: number }>(`/modifiers/${id}`, data) : this.post<{ id: number }>('/modifiers', data);
  deleteModifierGroup = (id: number) => this.delete(`/modifiers/${id}`);
  promotions = () => this.get<{ promotions: Promotion[] }>('/promotions').then((r) => r.promotions);
  savePromotion = (data: unknown, id?: number) =>
    id ? this.put<{ id: number }>(`/promotions/${id}`, data) : this.post<{ id: number }>('/promotions', data);
  deletePromotion = (id: number) => this.delete(`/promotions/${id}`);

  // Pedidos
  orderFormData = (channelId?: number) => this.get<OrderFormData>('/orders/form-data', { channel_id: channelId });
  orders = (filters: Params) => this.get<{ orders: OrderListRow[] }>('/orders', filters).then((r) => r.orders);
  order = (id: number) => this.get<{ order: OrderDetail }>(`/orders/${id}`).then((r) => r.order);
  previewOrder = (data: OrderInput, orderId?: number) => this.post<OrderPreview>('/orders/preview', data, { order_id: orderId });
  saveOrder = (data: OrderInput, id?: number) =>
    id ? this.put<{ id: number }>(`/orders/${id}`, data) : this.post<{ id: number }>('/orders', data);
  setOrderStatus = (id: number, status: string) => this.patch(`/orders/${id}/status`, { status });
  deleteOrder = (id: number) => this.delete(`/orders/${id}`);
  scanTicket = (file: Blob) => {
    const fd = new FormData();
    fd.append('image', file, 'ticket.png');
    return this.post<{ draft: OrderDraft }>('/ocr/scan', fd).then((r) => r.draft);
  };

  // Reportes
  day = (date?: string) => this.get<{ summary: DaySummary }>('/reports/day', { date }).then((r) => r.summary);
  dashboard = (from: string, to: string) =>
    this.get<{ dashboard: Dashboard }>('/reports/dashboard', { from, to }).then((r) => r.dashboard);
  alerts = () => this.get<{ alerts: Alert[] }>('/reports/alerts').then((r) => r.alerts);

  // Configuración
  settings = () => this.get<{ settings: AppSettings; channels: Channel[]; expenses: FixedExpense[] }>('/settings');
  saveSettings = (data: Partial<AppSettings>) => this.put('/settings', data);
  saveChannel = (data: Partial<Channel>, id?: number) =>
    id ? this.put(`/settings/channels/${id}`, data) : this.post('/settings/channels', data);
  deleteChannel = (id: number) => this.delete(`/settings/channels/${id}`);
  saveExpense = (data: Partial<FixedExpense>, id?: number) =>
    id ? this.put(`/settings/expenses/${id}`, data) : this.post('/settings/expenses', data);
  deleteExpense = (id: number) => this.delete(`/settings/expenses/${id}`);
  backups = () => this.get<{ backups: BackupInfo[] }>('/settings/backups').then((r) => r.backups);
  createBackup = () => this.post<{ backups: BackupInfo[] }>('/settings/backups', {}).then((r) => r.backups);
  exportUrl = (from: string, to: string) => `${this.base}/settings/export?from=${from}&to=${to}`;
}
