import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'hoy' },
  {
    path: 'hoy',
    title: 'Hoy',
    loadComponent: () => import('./features/today/today.page').then((m) => m.TodayPage),
  },
  {
    path: 'venta/nueva',
    title: 'Registrar venta',
    loadComponent: () => import('./features/orders/order-form.page').then((m) => m.OrderFormPage),
  },
  {
    path: 'venta/:id',
    title: 'Editar venta',
    loadComponent: () => import('./features/orders/order-form.page').then((m) => m.OrderFormPage),
  },
  {
    path: 'plataformas',
    title: 'Plataformas',
    loadComponent: () => import('./features/platforms/platforms.page').then((m) => m.PlatformsPage),
  },
  {
    path: 'ventas',
    title: 'Ventas',
    loadComponent: () => import('./features/orders/orders.page').then((m) => m.OrdersPage),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'precios',
    title: 'Precios y márgenes',
    loadComponent: () => import('./features/pricing/pricing.page').then((m) => m.PricingPage),
    canDeactivate: [(page: { canLeave: () => Promise<boolean> }) => page.canLeave()],
  },
  {
    path: 'recetas',
    title: 'Recetas',
    loadComponent: () => import('./features/recipes/recipes.page').then((m) => m.RecipesPage),
  },
  {
    path: 'recetas/nueva',
    title: 'Nueva receta',
    loadComponent: () =>
      import('./features/recipes/recipe-editor.page').then((m) => m.RecipeEditorPage),
  },
  {
    path: 'recetas/:id',
    title: 'Receta',
    loadComponent: () =>
      import('./features/recipes/recipe-editor.page').then((m) => m.RecipeEditorPage),
  },
  {
    path: 'ingredientes',
    title: 'Ingredientes',
    loadComponent: () =>
      import('./features/ingredients/ingredients.page').then((m) => m.IngredientsPage),
  },
  {
    path: 'modificadores',
    title: 'Modificadores',
    loadComponent: () => import('./features/catalogs/modifiers.page').then((m) => m.ModifiersPage),
  },
  {
    path: 'promociones',
    title: 'Promociones',
    loadComponent: () =>
      import('./features/catalogs/promotions.page').then((m) => m.PromotionsPage),
  },
  {
    path: 'alertas',
    title: 'Alertas',
    loadComponent: () => import('./features/alerts/alerts.page').then((m) => m.AlertsPage),
  },
  {
    path: 'configuracion',
    title: 'Configuración',
    loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage),
  },
  { path: '**', redirectTo: 'hoy' },
];
