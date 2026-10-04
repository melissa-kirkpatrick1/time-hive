import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { AcmePreset } from './theme/acme-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(
      // Matches CookieCsrfTokenRepository.withHttpOnlyFalse() on the server.
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([authInterceptor]),
    ),

    // PrimeNG overlays (dropdowns, dialogs) animate on open. If your Angular
    // version has dropped this provider, delete the line and the import.
    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: AcmePreset,
        options: {
          // Confines PrimeNG's generated CSS below this layer so our own styles
          // win without !important. Without it, component defaults override the
          // page styles unpredictably.
          cssLayer: { name: 'primeng', order: 'theme, base, primeng' },
          darkModeSelector: '.dark',
        },
      },
    }),
  ],
};
