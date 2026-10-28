import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { unwrapApiInterceptor } from '../api/unwrap-api.interceptor';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpTestingController;
  let auth: AuthService;
  let client: HttpClient;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor, unwrapApiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    client = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('stores the unwrapped token and sends it on the next request', () => {
    auth.login('ada@muji.example', 'secret').subscribe();
    const login = http.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(login.request.headers.has('Authorization')).toBe(false);
    login.flush({
      statusCode: 200,
      message: 'OK',
      data: {
        id: '1',
        email: 'ada@muji.example',
        firstName: 'Ada',
        lastName: 'Lovelace',
        role: 'operator',
        accessToken: 'tok-1',
      },
    });

    expect(auth.token()).toBe('tok-1');

    client.get(`${environment.apiBaseUrl}/transactions`).subscribe();
    const next = http.expectOne(`${environment.apiBaseUrl}/transactions`);
    expect(next.request.headers.get('Authorization')).toBe('Bearer tok-1');
    next.flush({ data: [], meta: { total: 0, page: 1, limit: 10, lastPage: 0 } });
  });

  it('clears the token when GET /auth/me returns 401', () => {
    auth.login('ada@muji.example', 'secret').subscribe();
    http.expectOne(`${environment.apiBaseUrl}/auth/login`).flush({
      statusCode: 200,
      message: 'Success',
      data: {
        id: '1',
        email: 'ada@muji.example',
        firstName: null,
        lastName: null,
        role: 'SUPER_ADMIN',
        accessToken: 'tok-1',
      },
    });

    auth.loadCurrentUser().subscribe({ error: () => undefined });
    const me = http.expectOne(`${environment.apiBaseUrl}/auth/me`);
    expect(me.request.headers.get('Authorization')).toBe('Bearer tok-1');
    me.flush(
      { statusCode: 401, message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(auth.token()).toBeNull();
    expect(auth.currentUser()).toBeNull();
  });
});
