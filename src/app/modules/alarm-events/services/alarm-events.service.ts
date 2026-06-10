import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/api/pagination.model';
import { AlarmEvent, ListAlarmsQuery } from '../models/alarm-event.model';

/** Read-only client for the alarm log (`/alarms`). */
@Injectable({ providedIn: 'root' })
export class AlarmEventsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/alarms`;

  list(query: ListAlarmsQuery): Observable<PaginatedResponse<AlarmEvent>> {
    const params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.limit);
    return this.http.get<PaginatedResponse<AlarmEvent>>(this.base, { params });
  }
}
