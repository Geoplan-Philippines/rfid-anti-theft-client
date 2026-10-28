import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Transactions } from './transactions';

describe('Transactions', () => {
  let fixture: ComponentFixture<Transactions>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transactions],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([], withDisabledInitialNavigation()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Transactions);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('shows a finished empty state when there are no sales', async () => {
    fixture.detectChanges();
    const req = http.expectOne((request) => request.url === `${environment.apiBaseUrl}/transactions`);
    req.flush({ data: [], meta: { total: 0, page: 1, limit: 10, lastPage: 0 } });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sales show up here when a till sends a stop.');
  });

  it('shows the item count and store code for a sale', async () => {
    fixture.detectChanges();
    const req = http.expectOne((request) => request.url === `${environment.apiBaseUrl}/transactions`);
    req.flush({
      data: [
        {
          id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          storeCode: 'MNL01',
          deviceId: 'TILL-4',
          cashierName: 'Ana',
          startedAt: '2026-10-28T02:15:00.000Z',
          endedAt: '2026-10-28T02:16:00.000Z',
          itemCount: 3,
        },
      ],
      meta: { total: 1, page: 1, limit: 10, lastPage: 1 },
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('MNL01');
    expect(text).toContain('3');
  });
});
