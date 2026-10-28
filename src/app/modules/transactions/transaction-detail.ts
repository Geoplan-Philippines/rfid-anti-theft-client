import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { groupEpc } from '../tag-registry/models/tag-registry.model';
import { TransactionsService } from './services/transactions.service';
import { TransactionDetail as SaleDetail } from './models/transaction.model';

@Component({
  selector: 'app-transaction-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, ButtonModule, SkeletonModule, TooltipModule],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.css',
})
export class TransactionDetail implements OnInit {
  private readonly service = inject(TransactionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly messages = inject(MessageService);

  protected readonly sale = signal<SaleDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal<string | null>(null);

  private readonly saleId = signal('');
  private readonly reload$ = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMsg.set(null);
        }),
        switchMap(() =>
          this.service.get(this.saleId()).pipe(
            catchError((err: HttpErrorResponse) => {
              this.errorMsg.set(this.loadError(err));
              this.sale.set(null);
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((sale) => {
        this.sale.set(sale);
        this.loading.set(false);
      });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.errorMsg.set('This sale has no id.');
      return;
    }
    this.saleId.set(id);
    this.load();
  }

  protected load(): void {
    this.reload$.next();
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

  private loadError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot reach the server. Check the API is running and CORS allows this origin.';
    }
    return `Could not load this sale (server returned ${err.status}). Please try again.`;
  }
}
