import { Component, computed, effect, inject, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { filter, map } from 'rxjs';
import { ApiService } from './core/api.service';
import { LiveService } from './core/live.service';
import { UiService } from './core/ui.service';
import { DesktopService } from './core/desktop.service';
import { PortalDockComponent } from './features/platforms/portal-dock.component';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    PortalDockComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private api = inject(ApiService);
  private router = inject(Router);
  readonly live = inject(LiveService);
  readonly ui = inject(UiService);
  readonly desktop = inject(DesktopService);

  readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 960px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );
  readonly opened = signal(true);
  readonly businessName = signal('Mi Dark Kitchen');
  readonly alertCount = signal(0);
  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: '' },
  );
  /** App de escritorio: los portales embebidos se muestran en /plataformas */
  readonly dockShown = computed(() => this.desktop.active && this.url().startsWith('/plataformas'));

  readonly sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Operación',
      items: [
        { path: '/hoy', label: 'Hoy', icon: 'today' },
        { path: '/venta/nueva', label: 'Registrar venta', icon: 'add_shopping_cart' },
        { path: '/ventas', label: 'Ventas', icon: 'receipt_long' },
        { path: '/plataformas', label: 'Plataformas', icon: 'view_column' },
      ],
    },
    {
      title: 'Análisis',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'monitoring' },
        { path: '/precios', label: 'Precios y márgenes', icon: 'sell' },
        { path: '/alertas', label: 'Alertas', icon: 'notifications' },
      ],
    },
    {
      title: 'Catálogo',
      items: [
        { path: '/recetas', label: 'Recetas', icon: 'menu_book' },
        { path: '/ingredientes', label: 'Ingredientes', icon: 'nutrition' },
        { path: '/modificadores', label: 'Modificadores', icon: 'tune' },
        { path: '/promociones', label: 'Promociones', icon: 'local_offer' },
      ],
    },
    { title: '', items: [{ path: '/configuracion', label: 'Configuración', icon: 'settings' }] },
  ];

  readonly mode = computed(() => (this.isMobile() ? 'over' : 'side'));

  constructor() {
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-rounded');
    effect(() => this.opened.set(!this.isMobile()));
    effect(() => this.desktop.setBadge(this.alertCount()));
    effect(() => {
      this.live.catalogVersion();
      this.live.ordersVersion();
      this.refreshHeader();
    });
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      if (this.isMobile()) this.opened.set(false);
    });
  }

  private async refreshHeader(): Promise<void> {
    try {
      const [alerts, settings] = await Promise.all([this.api.alerts(), this.api.settings()]);
      this.alertCount.set(alerts.filter((a) => a.level !== 'info' && !a.hidden).length);
      this.businessName.set(settings.settings.business_name);
    } catch {
      /* el backend aún no responde */
    }
  }
}
