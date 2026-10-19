import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialog, ConfirmData } from '../shared/confirm.dialog';
import { DEFAULT_THEME, THEMES, ThemeDef, ThemeId } from './themes';

/** Avisos, confirmaciones y tema visual. */
@Injectable({ providedIn: 'root' })
export class UiService {
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  readonly themes = THEMES;
  readonly theme = signal<ThemeId>(DEFAULT_THEME);
  readonly themeDef = computed<ThemeDef>(
    () => THEMES.find((t) => t.id === this.theme()) || THEMES[0],
  );
  /** Las gráficas usan su paleta para fondo oscuro */
  readonly dark = computed(() => this.themeDef().dark);

  constructor() {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      stored = null;
    }
    // Compatibilidad con la versión anterior que sólo guardaba claro/oscuro
    if (stored === 'dark') stored = 'oscuro';
    if (stored === 'light') stored = DEFAULT_THEME;
    const valid = THEMES.some((t) => t.id === stored);
    const prefersDark =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(valid ? (stored as ThemeId) : prefersDark ? 'oscuro' : DEFAULT_THEME);
  }

  setTheme(id: ThemeId): void {
    this.theme.set(id);
    const root = document.documentElement;
    for (const t of THEMES) root.classList.remove(`theme-${t.id}`);
    root.classList.add(`theme-${id}`);
    root.classList.toggle('dark', this.dark());
    try {
      localStorage.setItem('theme', id);
    } catch {
      /* sin almacenamiento local */
    }
  }

  ok(message: string): void {
    this.snack.open(message, 'OK', { duration: 3000 });
  }

  error(err: unknown, fallback = 'Algo salió mal'): void {
    let message = fallback;
    if (err instanceof HttpErrorResponse) {
      const body = err.error as { error?: string; details?: unknown } | null;
      if (err.status === 0)
        message = 'No hay conexión con el servidor. ¿Está corriendo el backend?';
      else if (body?.error) {
        const details = Array.isArray(body.details) ? `: ${body.details.join(', ')}` : '';
        message = body.error + details;
      }
    } else if (err instanceof Error) message = err.message;
    this.snack.open(message, 'Cerrar', { duration: 7000, panelClass: 'snack-error' });
  }

  confirm(data: ConfirmData): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialog, { data, width: '420px' });
    return firstValueFrom(ref.afterClosed()).then((r) => !!r);
  }
}
