import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';

import { TransactionsService } from './services/transactions.service';
import { TransactionSummary } from './models/transaction.model';

interface PageChange {
  first?: number;
  rows?: number;
}

@Component({
  selector: 'app-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ButtonModule, PaginatorModule, InputTextModule, SkeletonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private readonly service = inject(TransactionsService);
  private readonly router = inject(Router);

  protected readonly items = signal<TransactionSummary[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly limit = signal(10);
  protected readonly searchTerm = signal('');
  protected readonly activeSearch = signal('');
  protected readonly storeTerm = signal('');
  protected readonly activeStore = signal('');
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal<string | null>(null);

  protected readonly first = computed(() => (this.page() - 1) * this.limit());
  protected readonly isFiltering = computed(
    () =>
      this.activeSearch().length > 0 ||
      this.activeStore().length > 0 ||
      this.fromDate().length > 0 ||
      this.toDate().length > 0,
  );
  protected readonly hasRows = computed(() => this.items().length > 0);
  protected readonly skeletons = computed(() => Array.from({ length: this.limit() }));

  private readonly reload$ = new Subject<void>();
  private readonly searchInput$ = new Subject<string>();
  private readonly storeInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.activeSearch.set(term.trim());
        this.page.set(1);
        this.load();
      });

    this.storeInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.activeStore.set(term.trim());
        this.page.set(1);
        this.load();
      });

    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMsg.set(null);
        }),
        switchMap(() =>
          this.service
            .list({
              page: this.page(),
              limit: this.limit(),
              search: this.activeSearch() || undefined,
              storeCode: this.activeStore() || undefined,
              from: this.fromDate() || undefined,
              to: this.toDate() || undefined,
            })
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.errorMsg.set(this.listError(err));
                this.loading.set(false);
                return EMPTY;
              }),
            ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        this.items.set(data);
        this.total.set(res?.meta?.total ?? data.length);
        this.loading.set(false);
      });
  }

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.reload$.next();
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchInput$.next(value);
  }

  protected onStoreInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.storeTerm.set(value);
    this.storeInput$.next(value);
  }

  protected onFrom(event: Event): void {
    this.fromDate.set((event.target as HTMLInputElement).value);
    this.page.set(1);
    this.load();
  }

  protected onTo(event: Event): void {
    this.toDate.set((event.target as HTMLInputElement).value);
    this.page.set(1);
    this.load();
  }

  protected clearSearch(): void {
    this.searchTerm.set('');
    this.activeSearch.set('');
    this.searchInput$.next('');
    this.page.set(1);
    this.load();
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.activeSearch.set('');
    this.storeTerm.set('');
    this.activeStore.set('');
    this.fromDate.set('');
    this.toDate.set('');
    this.searchInput$.next('');
    this.storeInput$.next('');
    this.page.set(1);
    this.load();
  }

  protected onPage(event: PageChange): void {
    const rows = event.rows ?? this.limit();
    this.limit.set(rows);
    this.page.set(Math.floor((event.first ?? 0) / rows) + 1);
    this.load();
  }

  protected openSale(id: string): void {
    void this.router.navigate(['/transactions', id]);
  }

  protected onRowKey(event: Event, id: string): void {
    event.preventDefault();
    this.openSale(id);
  }

  protected shortId(id: string): string {
    return id.slice(0, 8);
  }

  private listError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot reach the server. Check the API is running and CORS allows this origin.';
    }
    return `Could not load transactions (server returned ${err.status}). Please try again.`;
  }
}
