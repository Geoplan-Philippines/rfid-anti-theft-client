import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

/** Emitted when the user picks another page or page size. `page` is 1-based. */
export interface ListPageChange {
  page: number;
  pageSize: number;
  /** Zero-based index of the first row on the page (PrimeNG's `first`). */
  first: number;
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

/**
 * The one footer every list uses: a "Showing x to y of n" summary on the left
 * and a PrimeNG Paginator on the right. It is stateless: the parent owns
 * total, page and page size.
 */
@Component({
  selector: 'app-list-paginator',
  imports: [PaginatorModule],
  templateUrl: './list-paginator.html',
  styleUrl: './list-paginator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPaginator {
  readonly total = input.required<number>();
  /** Current page, 1-based. */
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input<number[]>(DEFAULT_PAGE_SIZE_OPTIONS);
  /** Plural noun for the summary, e.g. "tags". */
  readonly itemLabel = input('items');

  readonly pageChange = output<ListPageChange>();

  protected readonly first = computed(() => Math.max(0, (this.page() - 1) * this.pageSize()));
  protected readonly rangeStart = computed(() => (this.total() > 0 ? this.first() + 1 : 0));
  protected readonly rangeEnd = computed(() => Math.min(this.first() + this.pageSize(), this.total()));
  protected readonly rowsPerPage = computed(() =>
    this.pageSizeOptions().length ? this.pageSizeOptions() : undefined,
  );

  protected onPageChange(state: PaginatorState): void {
    const pageSize = state.rows ?? this.pageSize();
    // A new page size starts over at page 1 so the user never lands past the end.
    if (pageSize !== this.pageSize()) {
      this.pageChange.emit({ page: 1, pageSize, first: 0 });
      return;
    }
    const page = (state.page ?? 0) + 1;
    this.pageChange.emit({ page, pageSize, first: (page - 1) * pageSize });
  }
}
