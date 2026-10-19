import {
  Component,
  ElementRef,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../core/api.service';
import { DesktopService } from '../../core/desktop.service';
import { UiService } from '../../core/ui.service';
import { PortalCode } from '../../core/portal.service';
import { Channel } from '../../core/models';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';

/** Métodos del <webview> de Electron que usamos */
interface WebviewTag extends HTMLElement {
  src: string;
  reload: () => void;
  goBack: () => void;
  canGoBack: () => boolean;
  loadURL: (url: string) => Promise<void>;
  setZoomFactor: (factor: number) => void;
}

interface DockPanel {
  code: PortalCode;
  name: string;
  color: string;
  url: string;
}

interface DockLayout {
  /** Proporción del ancho de cada panel abierto */
  widths: Record<PortalCode, number>;
  collapsed: Record<PortalCode, boolean>;
  zoom: Record<PortalCode, number>;
}

type UrlKey = 'portal_url_didi' | 'portal_url_uber' | 'portal_url_rappi';

/** Prioridad de plataformas: DiDi (la principal) más ancha, Rappi mediana y Uber angosta */
const ORDER: PortalCode[] = ['didi', 'rappi', 'uber'];
const DEFAULT_LAYOUT: DockLayout = {
  widths: { didi: 55, rappi: 30, uber: 15 },
  collapsed: { didi: false, rappi: false, uber: false },
  zoom: { didi: 1, rappi: 0.9, uber: 0.8 },
};
const STORAGE_KEY = 'portal-dock-layout';
const MIN_PX = 260;
const ZOOM_STEPS = [0.5, 0.6, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25];

const loadLayout = (): DockLayout => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as DockLayout | null;
    if (saved?.widths && saved.collapsed && saved.zoom) return saved;
  } catch {
    /* sin almacenamiento: acomodo por defecto */
  }
  return structuredClone(DEFAULT_LAYOUT);
};

/**
 * Portales de DiDi, Rappi y Uber dentro de la app de escritorio, lado a lado.
 * Vive en el shell de la app: los portales se cargan al abrir la app y siguen activos
 * (con sus sonidos de pedido nuevo) aunque se navegue a otra sección.
 */
@Component({
  selector: 'app-portal-dock',
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    ChannelBadgeComponent,
  ],
  host: { '[class.shown]': 'shown()' },
  template: `
    <div class="dock-bar">
      <mat-icon class="bar-icon">view_column</mat-icon>
      <div>
        <strong>Plataformas</strong>
        <div class="secondary small">
          Cada portal guarda su sesión y sigue activo aunque cambies de sección.
        </div>
      </div>
      <span class="spacer"></span>
      <button mat-button [matMenuTriggerFor]="layoutMenu">
        <mat-icon>dashboard_customize</mat-icon> Acomodo
      </button>
      <mat-menu #layoutMenu="matMenu">
        <button mat-menu-item (click)="preset('didi')">
          <mat-icon>looks_one</mat-icon> DiDi grande, Uber chico
        </button>
        <button mat-menu-item (click)="preset('equal')">
          <mat-icon>view_column</mat-icon> Los tres iguales
        </button>
        <button mat-menu-item (click)="preset('only-didi')">
          <mat-icon>crop_square</mat-icon> Sólo DiDi
        </button>
        <button mat-menu-item (click)="editing.set(!editing())">
          <mat-icon>link</mat-icon> Direcciones de los portales
        </button>
      </mat-menu>
      <a mat-stroked-button routerLink="/venta/nueva"
        ><mat-icon>add_shopping_cart</mat-icon> Registrar venta</a
      >
    </div>

    @if (editing()) {
      <div class="card urls">
        @for (p of panels(); track p.code) {
          <mat-form-field appearance="outline" class="dense">
            <mat-label>{{ p.name }}</mat-label>
            <input matInput [ngModel]="p.url" (change)="saveUrl(p, $any($event.target).value)" />
          </mat-form-field>
        }
        <button mat-button (click)="editing.set(false)">Listo</button>
      </div>
    }

    <div class="panels" #panelsEl [class.dragging]="dragging()">
      @for (p of panels(); track p.code) {
        @let closed = layout().collapsed[p.code];
        <section
          class="panel"
          [class.collapsed]="closed"
          [style.flex]="closed ? '0 0 40px' : layout().widths[p.code] + ' 1 0'"
          [style.border-top-color]="p.color"
          [attr.data-code]="p.code"
        >
          @if (closed) {
            <button
              class="strip"
              (click)="toggle(p.code)"
              [matTooltip]="'Mostrar ' + p.name"
              matTooltipPosition="right"
            >
              <span class="dot" [style.background]="p.color"></span>
              <span class="strip-name">{{ p.name }}</span>
            </button>
          } @else {
            <header class="panel-head">
              <app-channel [name]="p.name" [hex]="p.color" />
              <span class="spacer"></span>
              <button mat-icon-button class="tiny" (click)="back(p.code)" matTooltip="Atrás">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <button mat-icon-button class="tiny" (click)="reload(p.code)" matTooltip="Recargar">
                <mat-icon>refresh</mat-icon>
              </button>
              <button
                mat-icon-button
                class="tiny"
                [matMenuTriggerFor]="panelMenu"
                matTooltip="Zoom y más"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #panelMenu="matMenu">
                <div class="zoom-row" (click)="$event.stopPropagation()">
                  <button mat-icon-button (click)="zoomBy(p.code, -1)" aria-label="Alejar">
                    <mat-icon>zoom_out</mat-icon>
                  </button>
                  <span>{{ layout().zoom[p.code] * 100 | number: '1.0-0' }}%</span>
                  <button mat-icon-button (click)="zoomBy(p.code, 1)" aria-label="Acercar">
                    <mat-icon>zoom_in</mat-icon>
                  </button>
                </div>
                <button mat-menu-item (click)="desktop.openExternal(p.url)">
                  <mat-icon>open_in_new</mat-icon> Abrir en el navegador
                </button>
              </mat-menu>
              <button mat-icon-button class="tiny" (click)="toggle(p.code)" matTooltip="Encoger">
                <mat-icon>close_fullscreen</mat-icon>
              </button>
            </header>
            @if (loading()[p.code]) {
              <mat-progress-bar mode="indeterminate" class="loading" />
            }
            @if (failed()[p.code]; as msg) {
              <div class="failed small">
                <mat-icon>wifi_off</mat-icon> No cargó: {{ msg }}
                <button mat-button (click)="reload(p.code)">Reintentar</button>
              </div>
            }
            @if (!p.url) {
              <div class="failed small">
                Sin dirección.
                <button mat-button (click)="editing.set(true)">Agregar</button>
              </div>
            }
          }
          <div class="view" #host [class.offscreen]="closed" [attr.data-code]="p.code"></div>
        </section>
        @if (nextOpen(p.code); as next) {
          <div
            class="splitter"
            (pointerdown)="startDrag($event, p.code, next)"
            matTooltip="Arrastra para cambiar el tamaño"
          ></div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      left: -20000px;
      top: 0;
      width: 1400px;
      height: 900px;
      visibility: hidden;
      display: flex;
      flex-direction: column;
    }
    :host(.shown) {
      position: relative;
      left: auto;
      width: auto;
      height: 100%;
      visibility: visible;
    }
    .dock-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--card-border);
      background: var(--card-bg);
      .bar-icon {
        color: var(--mat-sys-primary);
      }
    }
    .urls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin: 8px 16px 0;
      padding-bottom: 0;
      mat-form-field {
        flex: 1;
        min-width: 240px;
      }
    }
    .panels {
      flex: 1;
      display: flex;
      min-height: 0;
      padding: 8px;
      gap: 0;
    }
    .panels.dragging {
      cursor: col-resize;
      user-select: none;
      .view {
        pointer-events: none;
      }
    }
    .panel {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: ${MIN_PX}px;
      border-radius: 12px;
      border-top: 4px solid;
      background: var(--card-bg);
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .panel.collapsed {
      min-width: 40px;
    }
    .panel-head {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px 6px 4px 10px;
      border-bottom: 1px solid var(--card-border);
    }
    .tiny {
      --mat-icon-button-state-layer-size: 28px;
      width: 28px;
      height: 28px;
      padding: 2px;
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    .zoom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding: 0 8px;
      font: var(--mat-sys-label-large);
    }
    .panel-head app-channel {
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .loading {
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .failed {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      color: var(--text-secondary);
      background: color-mix(in srgb, var(--warning) 10%, transparent);
    }
    .view {
      flex: 1;
      min-height: 0;
      display: flex;
    }
    .view.offscreen {
      position: fixed;
      left: -20000px;
      width: 800px;
      height: 800px;
      visibility: hidden;
    }
    .strip {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      border: none;
      background: transparent;
      color: var(--text-primary);
      cursor: pointer;
      font: var(--mat-sys-label-large);
      &:hover {
        background: color-mix(in srgb, var(--mat-sys-primary) 8%, transparent);
      }
    }
    .strip-name {
      writing-mode: vertical-rl;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .splitter {
      flex: 0 0 8px;
      cursor: col-resize;
      border-radius: 4px;
      &:hover {
        background: color-mix(in srgb, var(--mat-sys-primary) 30%, transparent);
      }
    }
    .small {
      font: var(--mat-sys-body-small);
    }
  `,
})
export class PortalDockComponent {
  private api = inject(ApiService);
  private ui = inject(UiService);
  readonly desktop = inject(DesktopService);

  /** true cuando se está en /plataformas; si no, los portales siguen cargados pero fuera de vista */
  readonly shown = input(false);

  readonly channels = signal<Channel[]>([]);
  readonly urls = signal<Partial<Record<UrlKey, string>>>({});
  readonly layout = signal<DockLayout>(loadLayout());
  readonly editing = signal(false);
  readonly dragging = signal(false);
  readonly loading = signal<Partial<Record<PortalCode, boolean>>>({});
  readonly failed = signal<Partial<Record<PortalCode, string>>>({});

  readonly panels = computed<DockPanel[]>(() =>
    ORDER.map((code) => {
      const ch = this.channels().find((c) => c.code === code);
      return {
        code,
        name: ch?.name || code,
        color: ch?.color || '#888888',
        url: this.urls()[`portal_url_${code}`] || '',
      };
    }),
  );

  private hosts = viewChildren<ElementRef<HTMLElement>>('host');
  private panelsEl = viewChild<ElementRef<HTMLElement>>('panelsEl');
  private views = new Map<PortalCode, WebviewTag>();

  constructor() {
    this.api
      .settings()
      .then((s) => {
        this.channels.set(s.channels);
        this.urls.set({
          portal_url_didi: s.settings.portal_url_didi,
          portal_url_rappi: s.settings.portal_url_rappi,
          portal_url_uber: s.settings.portal_url_uber,
        });
      })
      .catch((err) => this.ui.error(err));

    // Crea cada webview una sola vez, en cuanto hay contenedor y dirección
    effect(() => {
      const panels = this.panels();
      for (const host of this.hosts()) {
        const code = host.nativeElement.dataset['code'] as PortalCode;
        const panel = panels.find((p) => p.code === code);
        if (panel?.url && !this.views.has(code)) this.createView(panel, host.nativeElement);
      }
    });
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.layout()));
      } catch {
        /* sin almacenamiento */
      }
    });
  }

  private createView(panel: DockPanel, host: HTMLElement): void {
    const view = document.createElement('webview') as WebviewTag;
    // La partición va antes de src: cada plataforma conserva su propia sesión
    view.setAttribute('partition', `persist:${panel.code}`);
    view.setAttribute('allowpopups', '');
    view.setAttribute('webpreferences', 'backgroundThrottling=no');
    view.style.flex = '1';
    view.style.width = '100%';
    view.style.height = '100%';
    const code = panel.code;
    view.addEventListener('did-start-loading', () => this.setFlag(this.loading, code, true));
    view.addEventListener('did-stop-loading', () => this.setFlag(this.loading, code, false));
    view.addEventListener('dom-ready', () => {
      view.setZoomFactor(this.layout().zoom[code]);
      this.setFlag(this.failed, code, undefined);
    });
    view.addEventListener('did-fail-load', (e) => {
      const ev = e as Event & { errorCode: number; errorDescription: string; isMainFrame: boolean };
      // -3 = navegación cancelada (redirecciones normales)
      if (ev.isMainFrame && ev.errorCode !== -3)
        this.setFlag(this.failed, code, ev.errorDescription);
    });
    view.src = panel.url;
    host.appendChild(view);
    this.views.set(code, view);
  }

  private setFlag<T>(
    sig: WritableSignal<Partial<Record<PortalCode, T>>>,
    code: PortalCode,
    value: T,
  ): void {
    sig.update((m) => ({ ...m, [code]: value }));
  }

  /** Siguiente panel abierto a la derecha de `code` (para poner un divisor entre ambos) */
  nextOpen(code: PortalCode): PortalCode | null {
    const l = this.layout();
    if (l.collapsed[code]) return null;
    return ORDER.slice(ORDER.indexOf(code) + 1).find((c) => !l.collapsed[c]) ?? null;
  }

  toggle(code: PortalCode): void {
    this.layout.update((l) => ({
      ...l,
      collapsed: { ...l.collapsed, [code]: !l.collapsed[code] },
    }));
  }

  preset(kind: 'didi' | 'equal' | 'only-didi'): void {
    this.layout.update((l) => ({
      ...l,
      widths: kind === 'equal' ? { didi: 1, rappi: 1, uber: 1 } : { ...DEFAULT_LAYOUT.widths },
      collapsed: { didi: false, rappi: kind === 'only-didi', uber: kind === 'only-didi' },
    }));
  }

  back(code: PortalCode): void {
    const view = this.views.get(code);
    if (view?.canGoBack()) view.goBack();
  }

  reload(code: PortalCode): void {
    const view = this.views.get(code);
    const url = this.panels().find((p) => p.code === code)?.url;
    if (!view || !url) return;
    // Si falló la carga inicial se vuelve a pedir la dirección; si no, se recarga la página actual
    if (this.failed()[code] !== undefined) view.loadURL(url);
    else view.reload();
    this.setFlag(this.failed, code, undefined);
  }

  zoomBy(code: PortalCode, dir: 1 | -1): void {
    const current = this.layout().zoom[code];
    const idx = ZOOM_STEPS.findIndex((z) => z >= current - 0.001);
    const next =
      ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, Math.max(0, (idx < 0 ? 6 : idx) + dir))];
    this.layout.update((l) => ({ ...l, zoom: { ...l.zoom, [code]: next } }));
    this.views.get(code)?.setZoomFactor(next);
  }

  /** Arrastrar el divisor reparte el ancho entre los dos paneles vecinos */
  startDrag(event: PointerEvent, left: PortalCode, right: PortalCode): void {
    const container = this.panelsEl()?.nativeElement;
    const leftEl = container?.querySelector<HTMLElement>(`.panel[data-code="${left}"]`);
    const rightEl = container?.querySelector<HTMLElement>(`.panel[data-code="${right}"]`);
    if (!leftEl || !rightEl) return;
    event.preventDefault();
    const startX = event.clientX;
    const leftPx = leftEl.getBoundingClientRect().width;
    const pairPx = leftPx + rightEl.getBoundingClientRect().width;
    const { widths } = this.layout();
    const pairWeight = widths[left] + widths[right];
    this.dragging.set(true);

    const move = (e: PointerEvent) => {
      const newLeft = Math.min(pairPx - MIN_PX, Math.max(MIN_PX, leftPx + e.clientX - startX));
      const leftWeight = (pairWeight * newLeft) / pairPx;
      this.layout.update((l) => ({
        ...l,
        widths: { ...l.widths, [left]: leftWeight, [right]: pairWeight - leftWeight },
      }));
    };
    const up = () => {
      this.dragging.set(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  async saveUrl(p: DockPanel, value: string): Promise<void> {
    const url = value.trim();
    const key = `portal_url_${p.code}` as UrlKey;
    try {
      await this.api.saveSettings({ [key]: url });
      this.urls.update((u) => ({ ...u, [key]: url }));
      const view = this.views.get(p.code);
      if (view && url) view.loadURL(url);
      this.ui.ok(`Dirección de ${p.name} guardada`);
    } catch (err) {
      this.ui.error(err);
    }
  }
}
