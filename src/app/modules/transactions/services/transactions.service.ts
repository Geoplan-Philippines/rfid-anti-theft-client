import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/api/pagination.model';
import {
  TransactionDetail,
  TransactionListQuery,
  TransactionSummary,
} from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/transactions`;

  list(query: TransactionListQuery): Observable<PaginatedResponse<TransactionSummary>> {
    let params = new HttpParams().set('page', query.page).set('limit', query.limit);
    const search = query.search?.trim();
    if (search) {
      params = params.set('search', search);
    }
    const storeCode = query.storeCode?.trim();
    if (storeCode) {
      params = params.set('storeCode', storeCode);
    }
    const from = calendarDay(query.from);
    if (from) {
      params = params.set('from', from);
    }
    const to = calendarDay(query.to);
    if (to) {
      params = params.set('to', to);
    }
    return this.http.get<PaginatedResponse<TransactionSummary>>(this.base, { params });
  }

  get(id: string): Observable<TransactionDetail> {
    return this.http.get<TransactionDetail>(`${this.base}/${id}`);
  }
}

function calendarDay(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }
  return value;
}
