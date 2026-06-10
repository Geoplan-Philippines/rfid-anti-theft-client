import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/api/pagination.model';
import {
  DeleteEpcResult,
  KnownEpc,
  ListEpcsQuery,
  SaveEpcInput,
} from '../models/tag-registry.model';

/** CRUD client for watched EPCs (`/anti-theft/epcs`). */
@Injectable({ providedIn: 'root' })
export class TagRegistryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/anti-theft/epcs`;

  list(query: ListEpcsQuery): Observable<PaginatedResponse<KnownEpc>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.limit);
    const search = query.search?.trim();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PaginatedResponse<KnownEpc>>(this.base, { params });
  }

  get(id: string): Observable<KnownEpc> {
    return this.http.get<KnownEpc>(`${this.base}/${id}`);
  }

  create(input: SaveEpcInput): Observable<KnownEpc> {
    return this.http.post<KnownEpc>(this.base, input);
  }

  update(id: string, input: SaveEpcInput): Observable<KnownEpc> {
    return this.http.patch<KnownEpc>(`${this.base}/${id}`, input);
  }

  remove(id: string): Observable<DeleteEpcResult> {
    return this.http.delete<DeleteEpcResult>(`${this.base}/${id}`);
  }
}
