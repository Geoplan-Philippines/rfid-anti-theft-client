import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { MessageService } from 'primeng/api';

import { environment } from '../../../environments/environment';
import { TransactionDetail } from './transaction-detail';

describe('TransactionDetail', () => {
  let fixture: ComponentFixture<TransactionDetail>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([], withDisabledInitialNavigation()),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'sale-1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetail);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('shows each tag EPC', async () => {
    fixture.detectChanges();
    const req = http.expectOne(`${environment.apiBaseUrl}/transactions/sale-1`);
    req.flush({
      id: 'sale-1',
      storeCode: 'MNL01',
      deviceId: 'TILL-4',
      cashierName: null,
      startedAt: '2026-10-28T02:15:00.000Z',
      endedAt: '2026-10-28T02:16:00.000Z',
      itemCount: 3,
      clientTransactionId: 'client-1',
      tags: [
        { epc: 'E280689400004012AB000001', scannedAt: '2026-10-28T02:15:01.000Z' },
        { epc: 'E280689400004012AB000002', scannedAt: '2026-10-28T02:15:02.000Z' },
        { epc: 'E280689400004012AB000003', scannedAt: '2026-10-28T02:15:03.000Z' },
      ],
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('E280689400004012AB000001');
    expect(text).toContain('E280689400004012AB000002');
    expect(text).toContain('E280689400004012AB000003');
    expect(text).toContain('None');
  });
});
