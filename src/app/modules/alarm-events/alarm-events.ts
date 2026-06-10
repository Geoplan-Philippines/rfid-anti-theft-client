import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { AlarmEventsService } from './services/alarm-events.service';
import { AlarmEvent } from './models/alarm-event.model';

interface PageChange {
  first?: number;
  rows?: number;
}

@Component({
  selector: 'app-alarm-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ButtonModule, PaginatorModule, SkeletonModule, TooltipModule],
  templateUrl: './alarm-events.html',
  styleUrl: './alarm-events.css',
})
export class AlarmEvents implements OnInit {
  private readonly service = inject(AlarmEventsService);
  private readonly messages = inject(MessageService);

  protected readonly items = signal<AlarmEvent[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly limit = signal(10);
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal<string | null>(null);

  protected readonly first = computed(() => (this.page() - 1) * this.limit());
  protected readonly hasRows = computed(() => this.items().length > 0);
  protected readonly skeletons = computed(() => Array.from({ length: this.limit() }));

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

  protected onPage(event: PageChange): void {
    const rows = event.rows ?? this.limit();
    this.limit.set(rows);
    this.page.set(Math.floor((event.first ?? 0) / rows) + 1);
    this.load();
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
          detail: epc,
          life: 2000,
        }),
      () => undefined,
    );
  }

  private listError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot reach the server. Check the API is running and CORS allows this origin.';
    }
    return `Could not load alarm events (server returned ${err.status}). Please try again.`;
  }
}
