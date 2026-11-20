import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { environment } from '../../../environments/environment';
import { apiAssetUrl } from '../../core/api/asset-url';
import { Store } from './models/store.model';
import { Stores } from './stores';

const STORES_URL = `${environment.apiBaseUrl}/stores`;

const NUVALI: Store = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'MUJI-NUVALI',
  name: 'MUJI SM Nuvali',
  address: 'SM City Nuvali, Santa Rosa, Laguna',
  photoUrl: '/uploads/stores/nuvali.jpg',
  createdAt: '2026-11-19T08:00:00.000Z',
};

const MARIKINA: Store = {
  id: '22222222-2222-4222-8222-222222222222',
  code: 'MUJI-MARIKINA',
  name: 'MUJI SM City Marikina',
  address: null,
  photoUrl: null,
  createdAt: '2026-11-19T08:05:00.000Z',
};

describe('Stores', () => {
  let fixture: ComponentFixture<Stores>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stores],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(Stores);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  async function renderStores(stores: Store[]): Promise<HTMLElement> {
    fixture.detectChanges();
    const req = http.expectOne((request) => request.url === STORES_URL);
    expect(req.request.params.get('limit')).toBe('12');
    req.flush({ data: stores, meta: { total: stores.length, page: 1, limit: 12, lastPage: 1 } });
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows a card per store: photo from the API origin, or a placeholder when there is none', async () => {
    const page = await renderStores([NUVALI, MARIKINA]);
    const cards = page.querySelectorAll('app-store-card');

    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('h2')?.textContent?.trim()).toBe('MUJI SM Nuvali');
    expect(cards[0].textContent).toContain('MUJI-NUVALI');
    expect(cards[0].textContent).toContain('SM City Nuvali, Santa Rosa, Laguna');
    expect(cards[0].querySelector('img')?.getAttribute('src')).toBe(apiAssetUrl(NUVALI.photoUrl));

    expect(cards[1].querySelector('img')).toBeNull();
    expect(cards[1].querySelector('.pi-shop')).not.toBeNull();
    expect(cards[1].textContent).toContain('No address');
    expect(page.textContent).toContain('Showing 1 to 2 of 2 stores');
  });

  it('shows an empty state with a way to add the first store', async () => {
    const page = await renderStores([]);

    expect(page.textContent).toContain('No stores yet');
    expect(page.textContent).toContain('New store');
  });

  it('shows the server message when a code is already taken', async () => {
    await renderStores([NUVALI]);
    const component = fixture.componentInstance as unknown as {
      onSave: (input: { code: string; name: string; address: string; photo: File | null; removePhoto: boolean }) => void;
      openCreate: () => void;
      formError: () => string | null;
    };

    component.openCreate();
    component.onSave({ code: 'muji-nuvali', name: 'Copy', address: '', photo: null, removePhoto: false });
    const req = http.expectOne((request) => request.url === STORES_URL && request.method === 'POST');
    const body = req.request.body as FormData;
    expect(body.get('code')).toBe('muji-nuvali');
    expect(body.has('removePhoto')).toBe(false);
    req.flush(
      { statusCode: 409, message: 'A store with code "MUJI-NUVALI" already exists. Store codes are not case-sensitive.' },
      { status: 409, statusText: 'Conflict' },
    );

    expect(component.formError()).toBe(
      'A store with code "MUJI-NUVALI" already exists. Store codes are not case-sensitive.',
    );
  });
});
