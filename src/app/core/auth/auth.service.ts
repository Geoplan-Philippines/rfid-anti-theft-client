import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

const ACCESS_TOKEN_KEY = 'accessToken';

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface AuthSession extends CurrentUser {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  private readonly signedInUser = signal<CurrentUser | null>(null);

  /** The stored bearer token, or null when signed out. */
  readonly token = this.accessToken.asReadonly();

  /** The operator from POST /auth/login or GET /auth/me. */
  readonly currentUser = this.signedInUser.asReadonly();

  login(email: string, password: string): Observable<AuthSession> {
    return this.http
      .post<AuthSession>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap((session) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
          this.accessToken.set(session.accessToken);
          this.signedInUser.set({
            id: session.id,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
            role: session.role,
          });
        }),
      );
  }

  /** Confirms a stored token still belongs to a user. A 401 clears the session. */
  loadCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiBaseUrl}/auth/me`).pipe(
      tap((user) => this.signedInUser.set(user)),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.logout();
        }
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.accessToken.set(null);
    this.signedInUser.set(null);
  }
}
