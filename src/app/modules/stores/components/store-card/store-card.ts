import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { apiAssetUrl } from '../../../../core/api/asset-url';
import { Store } from '../../models/store.model';

/** One store in the grid: photo (or a quiet placeholder), name, address, code badge, edit and delete. */
@Component({
  selector: 'app-store-card',
  imports: [ButtonModule, TagModule, TooltipModule],
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-card border border-divider bg-surface"
      [attr.aria-labelledby]="headingId()"
    >
      <div class="aspect-[2/1] shrink-0 border-b border-divider bg-subtle">
        @if (photoSrc(); as src) {
          <img [src]="src" alt="" class="block h-full w-full object-cover" loading="lazy" decoding="async" />
        } @else {
          <div class="flex h-full w-full items-center justify-center text-faint">
            <i class="pi pi-shop text-2xl" aria-hidden="true"></i>
          </div>
        }
      </div>

      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="flex min-w-0 flex-col gap-1">
          <h2
            [id]="headingId()"
            class="m-0 truncate text-[0.9375rem] leading-snug text-heading"
            [attr.title]="store().name"
          >
            {{ store().name }}
          </h2>
          @if (store().address) {
            <p class="m-0 line-clamp-2 text-sm text-body">{{ store().address }}</p>
          } @else {
            <p class="m-0 text-sm text-muted">No address</p>
          }
        </div>

        <div class="mt-auto flex items-center justify-between gap-3">
          <p-tag class="min-w-0 break-all" severity="secondary" [value]="store().code" [rounded]="true" />
          <div class="flex shrink-0 items-center gap-1.5">
            <p-button
              icon="pi pi-pencil"
              severity="secondary"
              [outlined]="true"
              size="small"
              [ariaLabel]="'Edit ' + store().name"
              pTooltip="Edit"
              tooltipPosition="top"
              (onClick)="edit.emit(store())"
            />
            <p-button
              icon="pi pi-trash"
              severity="secondary"
              [outlined]="true"
              size="small"
              [ariaLabel]="'Delete ' + store().name"
              pTooltip="Delete"
              tooltipPosition="top"
              (onClick)="remove.emit(store())"
            />
          </div>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class StoreCard {
  readonly store = input.required<Store>();

  readonly edit = output<Store>();
  readonly remove = output<Store>();

  protected readonly photoSrc = computed(() => apiAssetUrl(this.store().photoUrl));
  protected readonly headingId = computed(() => `store-${this.store().id}-name`);
}
