import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginatedResponse, PaginationQuery, SaveStoreInput, Store } from '../models/store.model';

/** CRUD client for the store registry (`/stores`). Create and update send multipart so a photo can ride along. */
@Injectable({ providedIn: 'root' })
export class StoresService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/stores`;

  list(query: PaginationQuery): Observable<PaginatedResponse<Store>> {
    const params = new HttpParams().set('page', query.page).set('limit', query.limit);
    return this.http.get<PaginatedResponse<Store>>(this.base, { params });
  }

  create(input: SaveStoreInput): Observable<Store> {
    return this.http.post<Store>(this.base, toFormData({ ...input, removePhoto: false }));
  }

  update(id: string, input: SaveStoreInput): Observable<Store> {
    return this.http.patch<Store>(`${this.base}/${id}`, toFormData(input));
  }

  remove(id: string): Observable<Store> {
    return this.http.delete<Store>(`${this.base}/${id}`);
  }
}

/** The browser sets the multipart boundary, so no Content-Type header is set here. */
function toFormData(input: SaveStoreInput): FormData {
  const body = new FormData();
  body.set('code', input.code);
  body.set('name', input.name);
  body.set('address', input.address);
  if (input.photo) {
    body.set('photo', input.photo);
  } else if (input.removePhoto) {
    body.set('removePhoto', 'true');
  }
  return body;
}
