import { Component, computed, inject, input } from '@angular/core';
import { UiService } from '../core/ui.service';
import { seriesColor } from './chart-theme';

/** Punto de color + nombre del canal (la identidad nunca depende sólo del color). */
@Component({
  selector: 'app-channel',
  template: `<span class="badge"
    ><span class="dot" [style.background]="color()"></span>{{ name() }}</span
  >`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
  `,
})
export class ChannelBadgeComponent {
  readonly name = input.required<string>();
  readonly hex = input.required<string>();
  private ui = inject(UiService);
  readonly color = computed(() => seriesColor(this.hex(), this.ui.dark()));
}
