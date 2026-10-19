import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../core/api.service';
import { UiService } from '../../core/ui.service';
import { PortalCode, PortalService, PortalSlot } from '../../core/portal.service';
import { AppSettings, Channel } from '../../core/models';
import { ChannelBadgeComponent } from '../../shared/channel-badge.component';

interface PlatformCard {
  code: PortalCode;
  name: string;
  color: string;
  url: string;
  key: 'portal_url_didi' | 'portal_url_uber' | 'portal_url_rappi';
}

/** Prioridad de plataformas: DiDi, Rappi, Uber */
const ORDER: PortalCode[] = ['didi', 'rappi', 'uber'];

@Component({
  selector: 'app-platforms',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ChannelBadgeComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Plataformas</h1>
          <div class="subtitle">
            Abre los pedidos de DiDi, Uber y Rappi lado a lado, cada uno con tu sesión.
          </div>
        </div>
        <span class="spacer"></span>
        <a mat-stroked-button routerLink="/venta/nueva"
          ><mat-icon>add_shopping_cart</mat-icon> Registrar venta</a
        >
      </div>

      <div class="card launch">
        <div class="layout-preview" aria-hidden="true">
          @for (p of cards(); track p.code) {
            <div class="col" [style.border-color]="p.color">
              <span class="dot" [style.background]="p.color"></span>
              <span>{{ p.name }}</span>
            </div>
          }
        </div>
        <div class="launch-text">
          <h2>Abrir las 3 en tercios de la pantalla</h2>
          <p class="secondary">
            Cada plataforma se abre en su propia ventana, del mismo tamaño y acomodadas lado a lado.
            Si una ya está abierta sólo se trae al frente, sin recargarla.
          </p>
          <div class="row">
            <button mat-flat-button class="big" (click)="openAll()">
              <mat-icon>view_column</mat-icon> Abrir las 3 plataformas
            </button>
            <button
              mat-stroked-button
              (click)="openAll(true)"
              matTooltip="Cierra y vuelve a abrir las ventanas en su lugar"
            >
              <mat-icon>grid_view</mat-icon> Reacomodar
            </button>
            @if (portal.openCodes().length) {
              <button mat-button (click)="portal.closeAll()">
                <mat-icon>close</mat-icon> Cerrar ventanas
              </button>
            }
          </div>
        </div>
      </div>

      @if (portal.blocked().length) {
        <div class="card warn">
          <mat-icon>block</mat-icon>
          <div>
            <strong>El navegador bloqueó {{ portal.blocked().length }} ventana(s).</strong>
            <div class="secondary">
              Los navegadores sólo dejan abrir una ventana por clic, a menos que se permitan las
              ventanas emergentes. Haz clic en el ícono de ventana bloqueada en la barra de
              direcciones, elige
              <em>"Permitir siempre ventanas emergentes de localhost:4200"</em> y vuelve a presionar
              el botón. Mientras tanto puedes abrirlas una por una abajo.
            </div>
          </div>
        </div>
      }

      <div class="grid grid-3">
        @for (p of cards(); track p.code; let i = $index) {
          <div class="card platform" [style.border-top-color]="p.color">
            <div class="card-title">
              <app-channel [name]="p.name" [hex]="p.color" />
              <span class="spacer"></span>
              @if (portal.openCodes().includes(p.code)) {
                <span class="status ok"><mat-icon>check_circle</mat-icon> Abierta</span>
              } @else {
                <span class="status sin_precio">Cerrada</span>
              }
            </div>
            <mat-form-field appearance="outline" class="full dense">
              <mat-label>Dirección del portal</mat-label>
              <input matInput [(ngModel)]="p.url" (change)="saveUrl(p)" />
            </mat-form-field>
            <div class="row">
              <button mat-flat-button (click)="openOne(p, i)">
                <mat-icon>open_in_new</mat-icon>
                {{ portal.openCodes().includes(p.code) ? 'Traer al frente' : 'Abrir' }}
              </button>
              <a mat-button [href]="p.url" target="_blank" rel="noopener">En pestaña nueva</a>
            </div>
          </div>
        }
      </div>

      <p class="muted small note">
        ¿Por qué ventanas y no paneles dentro de la app? Uber no permite mostrarse dentro de otra
        página y DiDi/Rappi pierden la sesión dentro de un iframe. Con ventanas separadas cada
        portal funciona completo, con sus sonidos de pedido nuevo. En la app de escritorio los tres
        portales se muestran dentro de la app, DiDi más grande.
      </p>
    </div>
  `,
  styles: `
    .launch {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;
      h2 {
        font: var(--mat-sys-title-large);
        margin: 0 0 4px;
      }
    }
    .launch-text {
      flex: 1;
      min-width: 280px;
    }
    .big {
      height: 48px;
      font-size: 16px;
    }
    .layout-preview {
      display: flex;
      gap: 6px;
      width: 260px;
      height: 130px;
      padding: 6px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--text-muted) 12%, transparent);
      .col {
        flex: 1;
        border-radius: 8px;
        border-top: 6px solid;
        background: var(--card-bg);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font: var(--mat-sys-label-medium);
      }
    }
    .warn {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      border-color: color-mix(in srgb, var(--warning) 60%, transparent);
      background: color-mix(in srgb, var(--warning) 10%, var(--card-bg));
      mat-icon {
        color: var(--serious);
      }
    }
    .platform {
      border-top: 4px solid;
    }
    .small {
      font: var(--mat-sys-body-small);
    }
    .note {
      margin-top: 16px;
    }
  `,
})
export class PlatformsPage {
  private api = inject(ApiService);
  private ui = inject(UiService);
  readonly portal = inject(PortalService);

  readonly settings = signal<AppSettings | null>(null);
  readonly channels = signal<Channel[]>([]);
  readonly cards = computed<PlatformCard[]>(() => {
    const s = this.settings();
    return ORDER.map((code) => {
      const ch = this.channels().find((c) => c.code === code);
      const key = `portal_url_${code}` as PlatformCard['key'];
      return {
        code,
        key,
        name: ch?.name || code,
        color: ch?.color || '#888888',
        url: (s?.[key] as string) || '',
      };
    });
  });

  constructor() {
    this.api
      .settings()
      .then((s) => {
        this.channels.set(s.channels);
        this.settings.set(s.settings);
      })
      .catch((err) => this.ui.error(err));
  }

  private slots(): PortalSlot[] {
    return this.cards()
      .filter((c) => c.url)
      .map((c) => ({ code: c.code, url: c.url }));
  }

  openAll(reopen = false): void {
    const slots = this.slots();
    const blocked = this.portal.openAll(slots, reopen);
    if (!blocked.length) this.ui.ok(`Plataformas abiertas: ${slots.length}`);
  }

  openOne(p: PlatformCard, index: number): void {
    if (!this.portal.open({ code: p.code, url: p.url }, index, ORDER.length)) {
      this.portal.blocked.set([p.code]);
    } else {
      this.portal.blocked.set(this.portal.blocked().filter((c) => c !== p.code));
    }
  }

  async saveUrl(p: PlatformCard): Promise<void> {
    try {
      await this.api.saveSettings({ [p.key]: p.url.trim() });
      this.settings.update((s) => (s ? { ...s, [p.key]: p.url.trim() } : s));
      this.ui.ok(`Dirección de ${p.name} guardada`);
    } catch (err) {
      this.ui.error(err);
    }
  }
}
