import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  API_BASE_URL,
  DEV_API_CONFIG,
  PRODUCTION_API_CONFIG,
} from '@super-fitness/data-access-user';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    {
      provide: API_BASE_URL,
      useFactory: () =>
        (isDevMode() ? DEV_API_CONFIG : PRODUCTION_API_CONFIG).apiBaseUrl,
    },
    provideRouter(appRoutes),
  ],
};
