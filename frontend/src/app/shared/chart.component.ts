import { Component, ElementRef, OnDestroy, effect, inject, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { UiService } from '../core/ui.service';
import './chart-theme';

/**
 * Lienzo de Chart.js. Recibe la configuración como una función del modo oscuro
 * para que los colores se recalculen al cambiar de tema.
 */
@Component({
  selector: 'app-chart',
  template: `<div class="wrap" [style.height.px]="height()"><canvas #canvas [attr.aria-label]="label()" role="img"></canvas></div>`,
  styles: `
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      width: 100%;
    }
  `
})
export class ChartComponent implements OnDestroy {
  readonly config = input.required<(dark: boolean) => ChartConfiguration>();
  readonly height = input(260);
  readonly label = input('Gráfica');
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private ui = inject(UiService);
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      this.ui.theme(); // redibujar al cambiar de tema (colores de ejes y fondo)
      const cfg = this.config()(this.ui.dark());
      const el = this.canvas().nativeElement;
      // Esperar a que el cambio de tema aplique las variables CSS
      requestAnimationFrame(() => {
        this.chart?.destroy();
        this.chart = new Chart(el, cfg);
      });
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
