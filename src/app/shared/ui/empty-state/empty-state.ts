import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Quiet empty state for lists: a small icon, one line of title and an
 * optional description. Project an action button as content.
 */
@Component({
  selector: 'app-empty-state',
  template: `
    <span class="empty-icon" aria-hidden="true"><i [class]="icon()"></i></span>
    <p class="empty-title">{{ heading() }}</p>
    @if (description()) {
      <p class="empty-body">{{ description() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
      max-width: 28rem;
      margin: 0 auto;
      padding: 3rem 1rem;
      text-align: center;
    }
    .empty-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      margin-bottom: 0.375rem;
      border-radius: var(--pill-radius);
      background: var(--subtle);
      color: var(--text-muted);
      font-size: 1rem;
    }
    .empty-title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-heading);
    }
    .empty-body {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'empty-state' },
})
export class EmptyState {
  readonly icon = input('pi pi-inbox');
  readonly heading = input.required<string>();
  readonly description = input<string | null>();
}
