import { Injectable, signal } from '@angular/core';

export type PortalCode = 'didi' | 'uber' | 'rappi';

export interface PortalSlot {
  code: PortalCode;
  url: string;
}

/**
 * Abre los portales de las plataformas en ventanas del navegador acomodadas en
 * columnas. Las páginas de Uber (y las sesiones de DiDi/Rappi) no funcionan dentro
 * de un iframe, por eso se usan ventanas reales que conservan la sesión.
 */
@Injectable({ providedIn: 'root' })
export class PortalService {
  private windows = new Map<PortalCode, Window>();
  /** Plataformas cuya ventana fue bloqueada por el navegador en el último intento */
  readonly blocked = signal<PortalCode[]>([]);
  readonly openCodes = signal<PortalCode[]>([]);

  constructor() {
    // Refrescar qué ventanas siguen abiertas
    setInterval(() => this.refresh(), 2000);
  }

  isOpen(code: PortalCode): boolean {
    const w = this.windows.get(code);
    return !!w && !w.closed;
  }

  /** Rectángulo de la columna `index` de `total` en la pantalla disponible. */
  private rect(
    index: number,
    total: number,
  ): { left: number; top: number; width: number; height: number } {
    const s = window.screen as Screen & { availLeft?: number; availTop?: number };
    const left0 = s.availLeft ?? 0;
    const top0 = s.availTop ?? 0;
    const width = Math.floor(s.availWidth / total);
    return { left: left0 + index * width, top: top0, width, height: s.availHeight };
  }

  /**
   * Abre una plataforma en su columna. Si su ventana ya está abierta sólo la trae
   * al frente (sin recargar), salvo que `reopen` sea true.
   */
  open(slot: PortalSlot, index: number, total: number, reopen = false): boolean {
    const existing = this.windows.get(slot.code);
    if (existing && !existing.closed) {
      if (!reopen) {
        existing.focus();
        return true;
      }
      existing.close();
    }
    const r = this.rect(index, total);
    const features = `popup=yes,left=${r.left},top=${r.top},width=${r.width},height=${r.height}`;
    const w = window.open(slot.url, `portal_${slot.code}`, features);
    if (!w) return false;
    this.windows.set(slot.code, w);
    this.refresh();
    return true;
  }

  /** Abre todas las plataformas acomodadas en columnas. Devuelve las que el navegador bloqueó. */
  openAll(slots: PortalSlot[], reopen = false): PortalCode[] {
    const blocked = slots
      .filter((s, i) => !this.open(s, i, slots.length, reopen))
      .map((s) => s.code);
    this.blocked.set(blocked);
    return blocked;
  }

  focus(code: PortalCode): void {
    this.windows.get(code)?.focus();
  }

  closeAll(): void {
    for (const w of this.windows.values()) if (!w.closed) w.close();
    this.windows.clear();
    this.refresh();
  }

  private refresh(): void {
    const open = (['didi', 'rappi', 'uber'] as PortalCode[]).filter((c) => this.isOpen(c));
    const current = this.openCodes();
    if (open.length !== current.length || open.some((c, i) => c !== current[i]))
      this.openCodes.set(open);
  }
}
