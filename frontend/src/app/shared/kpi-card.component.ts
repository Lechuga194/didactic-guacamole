import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fmtPct } from '../core/format';

/** Ficha de indicador: valor grande, comparación opcional y barra de meta. */
@Component({
  selector: 'app-kpi',
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <div class="kpi" [class.hero]="hero()">
      <div class="top">
        <mat-icon>{{ icon() }}</mat-icon>
        <span class="label">{{ label() }}</span>
        @if (help()) {
          <mat-icon class="help" [matTooltip]="help()">info</mat-icon>
        }
      </div>
      <div class="value" [class.neg]="negative()">{{ value() }}</div>
      @if (deltaPct() !== null) {
        <div class="delta" [class.up]="(deltaPct() ?? 0) >= 0" [class.down]="(deltaPct() ?? 0) < 0">
          <mat-icon>{{ (deltaPct() ?? 0) >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          {{ deltaText() }} <span class="muted">{{ deltaLabel() }}</span>
        </div>
      } @else if (sub()) {
        <div class="sub">{{ sub() }}</div>
      }
      @if (goal() > 0) {
        <div class="goal">
          <div class="bar"><div class="fill" [style.width.%]="goalPct()"></div></div>
          <span>{{ goalText() }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .kpi {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 16px 18px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .kpi.hero {
      background: var(--hero-grad);
      border: none;
      color: var(--hero-text);
      .label,
      .sub,
      .muted,
      .delta,
      .goal span {
        color: color-mix(in srgb, var(--hero-text) 85%, transparent) !important;
      }
      .bar {
        background: color-mix(in srgb, var(--hero-text) 22%, transparent);
      }
      .fill {
        background: var(--hero-text);
      }
      .value.neg {
        color: var(--hero-text);
      }
    }
    .top {
      display: flex;
      align-items: center;
      gap: 6px;
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        opacity: 0.85;
      }
      .help {
        font-size: 16px;
        width: 16px;
        height: 16px;
        opacity: 0.6;
        cursor: help;
      }
    }
    .label {
      font: var(--mat-sys-label-large);
      color: var(--text-secondary);
    }
    .value {
      font-size: 28px;
      font-weight: 500;
      line-height: 1.15;
      letter-spacing: -0.5px;
    }
    .value.neg {
      color: var(--critical-text);
    }
    .sub {
      font: var(--mat-sys-body-small);
      color: var(--text-secondary);
    }
    .delta {
      display: flex;
      align-items: center;
      gap: 4px;
      font: var(--mat-sys-body-small);
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      &.up {
        color: var(--good-text);
      }
      &.down {
        color: var(--critical-text);
      }
    }
    .goal {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      font: var(--mat-sys-body-small);
      color: var(--text-secondary);
      .bar {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: var(--viz-grid);
        overflow: hidden;
      }
      .fill {
        height: 100%;
        background: var(--good);
        border-radius: 3px;
      }
    }
  `
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input('insights');
  readonly sub = input<string | null>(null);
  readonly help = input<string>('');
  readonly hero = input(false);
  readonly negative = input(false);
  readonly deltaPct = input<number | null>(null);
  readonly deltaLabel = input('vs periodo anterior');
  readonly invertDelta = input(false);
  readonly goal = input(0);
  readonly current = input(0);

  readonly deltaText = computed(() => {
    const d = this.deltaPct();
    return d === null ? '' : `${d >= 0 ? '+' : ''}${fmtPct(d)}`;
  });
  readonly goalPct = computed(() => Math.max(0, Math.min(100, (this.current() / this.goal()) * 100)));
  readonly goalText = computed(() => `${Math.round((this.current() / this.goal()) * 100)}% de la meta`);
}
