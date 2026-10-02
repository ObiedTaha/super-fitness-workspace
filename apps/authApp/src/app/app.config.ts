import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  API_BASE_URL,
  DEV_API_CONFIG,
  PRODUCTION_API_CONFIG,
} from '@super-fitness/data-access-user';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
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
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideRouter(appRoutes),
  ],
};
