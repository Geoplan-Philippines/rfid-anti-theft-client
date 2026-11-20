import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

import { PageLayout } from '../../shared/ui/page-layout/page-layout';
import { ListPageChange, ListPaginator } from '../../shared/ui/list-paginator/list-paginator';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { StoreCard } from './components/store-card/store-card';
import { StoreFormDialog } from './components/store-form-dialog/store-form-dialog';
import { StoresService } from './services/stores.service';
import { SaveStoreInput, Store } from './models/store.model';

const UNREACHABLE = 'Cannot reach the server. Check the API is running and CORS allows this origin.';
/** Page sizes that fill whole rows of a 2, 3 or 4 column grid. */
const GRID_PAGE_SIZES = [12, 24, 48];

@Component({
  selector: 'app-stores',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageLayout,
    ListPaginator,
    EmptyState,
    StoreCard,
    StoreFormDialog,
    ButtonModule,
    DialogModule,
    MessageModule,
    SkeletonModule,
  ],
  templateUrl: './stores.html',
})
export class Stores implements OnInit {
  private readonly service = inject(StoresService);
  private readonly messages = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSizes = GRID_PAGE_SIZES;
  protected readonly items = signal<Store[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly limit = signal(GRID_PAGE_SIZES[0]);
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal<string | null>(null);

  protected readonly dialogOpen = signal(false);
  protected readonly editingStore = signal<Store | null>(null);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  /** The store awaiting delete confirmation; the confirm dialog is open while set. */
  protected readonly storeToDelete = signal<Store | null>(null);

  protected readonly hasStores = computed(() => this.items().length > 0);
  protected readonly skeletons = computed(() => Array.from({ length: Math.min(this.limit(), 4) }));

  private readonly reload$ = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMsg.set(null);
        }),
        switchMap(() =>
          this.service.list({ page: this.page(), limit: this.limit() }).pipe(
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

  protected onPage(event: ListPageChange): void {
    this.limit.set(event.pageSize);
    this.page.set(event.page);
    this.load();
  }

  protected openCreate(): void {
    this.editingStore.set(null);
    this.formError.set(null);
    this.dialogOpen.set(true);
  }

  protected openEdit(store: Store): void {
    this.editingStore.set(store);
    this.formError.set(null);
    this.dialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingStore.set(null);
    this.formError.set(null);
  }

  protected onSave(input: SaveStoreInput): void {
    this.submitting.set(true);
    this.formError.set(null);
    const editingId = this.editingStore()?.id ?? null;
    const request$ = editingId ? this.service.update(editingId, input) : this.service.create(input);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (saved) => {
        this.submitting.set(false);
        this.closeDialog();
        this.messages.add({
          severity: 'success',
          summary: editingId ? 'Store updated' : 'Store added',
          detail: saved.name,
          life: 3000,
        });
        if (!editingId) {
          this.page.set(1);
        }
        this.load();
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.formError.set(this.saveError(err));
      },
    });
  }

  protected onDelete(store: Store): void {
    this.storeToDelete.set(store);
  }

  protected cancelDelete(): void {
    this.storeToDelete.set(null);
  }

  protected confirmDelete(): void {
    const store = this.storeToDelete();
    this.storeToDelete.set(null);
    if (store) {
      this.performDelete(store);
    }
  }

  private performDelete(store: Store): void {
    this.service
      .remove(store.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messages.add({ severity: 'success', summary: 'Store deleted', detail: store.name, life: 3000 });
          if (this.items().length === 1 && this.page() > 1) {
            this.page.update((page) => page - 1);
          }
          this.load();
        },
        error: (err: unknown) =>
          this.messages.add({ severity: 'error', summary: 'Delete failed', detail: this.saveError(err), life: 5000 }),
      });
  }

  private listError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return UNREACHABLE;
    }
    return `Could not load stores (server returned ${err.status}). Please try again.`;
  }

  /** The server's own message for validation (400), missing (404), duplicate code (409) and photo size (413). */
  private saveError(err: unknown): string {
    if (!(err instanceof HttpErrorResponse)) {
      return 'Something went wrong. Please try again.';
    }
    if (err.status === 0) {
      return UNREACHABLE;
    }
    const message = serverMessage(err);
    if (err.status === 413) {
      return message || 'Photo must be 5 MB or smaller.';
    }
    if (message && [400, 404, 409].includes(err.status)) {
      return message;
    }
    return `Couldn't save this store. The server returned ${err.status}${message ? `: ${message}` : '.'}`;
  }
}

/** Nest sends `message` as a string, or a list of strings for validation errors. */
function serverMessage(err: HttpErrorResponse): string {
  const body: unknown = err.error;
  if (!body || typeof body !== 'object' || !('message' in body)) {
    return '';
  }
  const message = body.message;
  if (Array.isArray(message)) {
    return message.filter((part): part is string => typeof part === 'string').join(' ');
  }
  return typeof message === 'string' ? message : '';
}
