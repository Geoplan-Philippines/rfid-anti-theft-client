import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Transactions } from './transactions';
import { TransactionSummary } from './models/transaction.model';

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

  it('shows the store code with its name, the POS number, and no Till or Id column', async () => {
    const text = await renderSales([
      sale({ storeCode: 'MUJI-NUVALI', storeName: 'MUJI SM Nuvali', registered: true, itemCount: 3 }),
    ]);

    expect(text).toContain('MUJI-NUVALI');
    expect(text).toContain('MUJI SM Nuvali');
    expect(text).toContain('POS-03-HAX7700');
    expect(text).not.toContain('Not registered');

    const headers = headerLabels();
    expect(headers).toEqual(['Time', 'Store', 'POS Number', 'Cashier', 'Items']);
  });

  it('tags a sale whose store code is not registered', async () => {
    const text = await renderSales([sale({ storeCode: 'POC', storeName: null, registered: false })]);

    expect(text).toContain('POC');
    expect(text).toContain('Not registered');
  });

  async function renderSales(data: TransactionSummary[]): Promise<string> {
    fixture.detectChanges();
    const req = http.expectOne((request) => request.url === `${environment.apiBaseUrl}/transactions`);
    req.flush({ data, meta: { total: data.length, page: 1, limit: 10, lastPage: 1 } });
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement.textContent as string;
  }

  function headerLabels(): string[] {
    const cells = fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>;
    return Array.from(cells, (cell) => cell.textContent?.trim() ?? '');
  }
});

function sale(overrides: Partial<TransactionSummary>): TransactionSummary {
  return {
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    storeCode: 'MUJI-NUVALI',
    storeName: null,
    registered: false,
    deviceId: 'POS-03-HAX7700',
    cashierName: 'Ana',
    startedAt: '2026-10-28T02:15:00.000Z',
    endedAt: '2026-10-28T02:16:00.000Z',
    itemCount: 1,
    ...overrides,
  };
}
