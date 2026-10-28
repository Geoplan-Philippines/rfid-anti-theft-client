import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TagRegistryService } from './services/tag-registry.service';
import { TagRegistryFormDialog } from './components/tag-registry-form-dialog/tag-registry-form-dialog';
import { EpcFormatPipe } from './pipes/epc-format.pipe';
import { KnownEpc, SaveEpcInput, groupEpc } from './models/tag-registry.model';

interface PageChange {
  first?: number;
  rows?: number;
}

@Component({
  selector: 'app-tag-registry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    EpcFormatPipe,
    TagRegistryFormDialog,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    SkeletonModule,
    TooltipModule,
  ],
  templateUrl: './tag-registry.html',
  styleUrl: './tag-registry.css',
})
export class TagRegistry implements OnInit {
  private readonly service = inject(TagRegistryService);
  private readonly messages = inject(MessageService);
  private readonly confirm = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = signal<KnownEpc[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly limit = signal(10);
  protected readonly searchTerm = signal('');
  protected readonly activeSearch = signal('');
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal<string | null>(null);

  protected readonly dialogOpen = signal(false);
  protected readonly dialogMode = signal<'create' | 'edit'>('create');
  protected readonly editingTag = signal<KnownEpc | null>(null);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly first = computed(() => (this.page() - 1) * this.limit());
  protected readonly isSearching = computed(() => this.activeSearch().length > 0);
  protected readonly hasRows = computed(() => this.items().length > 0);
  protected readonly skeletons = computed(() => Array.from({ length: this.limit() }));

  private readonly reload$ = new Subject<void>();
  private readonly searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.activeSearch.set(term.trim());
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

  protected clearSearch(): void {
    this.searchTerm.set('');
    this.activeSearch.set('');
    this.page.set(1);
    this.load();
  }

  protected onPage(event: PageChange): void {
    const rows = event.rows ?? this.limit();
    this.limit.set(rows);
    this.page.set(Math.floor((event.first ?? 0) / rows) + 1);
    this.load();
  }

  protected openCreate(): void {
    this.editingTag.set(null);
    this.dialogMode.set('create');
    this.formError.set(null);
    this.dialogOpen.set(true);
  }

  protected openEdit(tag: KnownEpc): void {
    this.editingTag.set(tag);
    this.dialogMode.set('edit');
    this.formError.set(null);
    this.dialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingTag.set(null);
    this.formError.set(null);
  }

  protected onSave(input: SaveEpcInput): void {
    this.submitting.set(true);
    this.formError.set(null);
    const editingId = this.editingTag()?.id ?? null;
    const request$ = editingId
      ? this.service.update(editingId, input)
      : this.service.create(input);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting.set(false);
        const created = editingId === null;
        this.dialogOpen.set(false);
        this.editingTag.set(null);
        this.messages.add({
          severity: 'success',
          summary: created ? 'Tag added' : 'Tag updated',
          detail: groupEpc(input.epc),
          life: 3000,
        });
        if (created) {
          this.page.set(1);
        }
        this.load();
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        console.error('Save EPC failed', err);
        this.formError.set(this.saveError(err));
      },
    });
  }

  protected onDelete(tag: KnownEpc): void {
    this.confirm.confirm({
      header: 'Delete tag',
      message: `Remove ${groupEpc(tag.epc)} from the sold list? The gate will alarm on it again, and this can't be undone.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete tag',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => this.performDelete(tag),
    });
  }

  protected copyEpc(epc: string): void {
    const clipboard = navigator.clipboard;
    if (!clipboard?.writeText) {
      return;
    }
    clipboard.writeText(epc).then(
      () =>
        this.messages.add({
          severity: 'info',
          summary: 'EPC copied',
          detail: groupEpc(epc),
          life: 2000,
        }),
      () => undefined,
    );
  }

  private performDelete(tag: KnownEpc): void {
    this.service
      .remove(tag.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messages.add({
            severity: 'success',
            summary: 'Tag deleted',
            detail: groupEpc(tag.epc),
            life: 3000,
          });
          if (this.items().length === 1 && this.page() > 1) {
            this.page.set(this.page() - 1);
          }
          this.load();
        },
        error: (err: unknown) =>
          this.messages.add({
            severity: 'error',
            summary: 'Delete failed',
            detail: this.saveError(err),
            life: 4000,
          }),
      });
  }

  private listError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot reach the server. Check the API is running and CORS allows this origin.';
    }
    return `Could not load tags (server returned ${err.status}). Please try again.`;
  }

  private saveError(err: unknown): string {
    const response = err as HttpErrorResponse;
    const status = response?.status;
    const body = response?.error as { message?: unknown } | string | null;
    const serverMessage =
      typeof body === 'string' ? body : typeof body?.message === 'string' ? body.message : '';

    if (status === 0) {
      return 'Cannot reach the server. Check the API is running and CORS allows this origin.';
    }
    if (status === 409 || /unique|already exists|constraint|P2002/i.test(serverMessage)) {
      return 'This EPC is already registered.';
    }
    if (status === 400) {
      return serverMessage || 'Check the EPC and try again.';
    }
    const detail = serverMessage ? `: ${serverMessage}` : '.';
    return `Couldn't save this tag. The server returned ${status ?? 'an error'}${detail}`;
  }
}
