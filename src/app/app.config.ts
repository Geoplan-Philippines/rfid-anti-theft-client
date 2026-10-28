import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';
import { AppPreset } from './core/theme/app-preset';
import { unwrapApiInterceptor } from './core/api/unwrap-api.interceptor';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, unwrapApiInterceptor])),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          // Light only: never resolve to a dark scheme.
          darkModeSelector: false,
          // Keep PrimeNG below Tailwind utilities so utility classes win.
          cssLayer: { name: 'primeng', order: 'theme, base, primeng, components, utilities' },
        },
      },
      ripple: false,
    }),
    MessageService,
    ConfirmationService,
  ],
};
