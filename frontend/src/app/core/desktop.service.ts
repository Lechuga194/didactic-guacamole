import { Injectable } from '@angular/core';

interface DesktopBridge {
  platform: string;
  setBadge: (count: number) => void;
  openExternal: (url: string) => void;
}

/** Funciones de la app de escritorio (Electron). En el navegador `active` es false. */
@Injectable({ providedIn: 'root' })
export class DesktopService {
  private bridge = (window as unknown as { cocinaDesktop?: DesktopBridge }).cocinaDesktop;
  readonly active = !!this.bridge;
  readonly platform = this.bridge?.platform ?? 'web';

  setBadge(count: number): void {
    this.bridge?.setBadge(count);
  }

  openExternal(url: string): void {
    if (this.bridge) this.bridge.openExternal(url);
    else window.open(url, '_blank', 'noopener');
  }
}
