import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from './core/config/api-base-url.token';
import { authInterceptor } from './core/http/interceptors/auth.interceptor';
import { AUTH_REPOSITORY } from './features/auth/domain/repositories/auth-repository.token';
import { AuthHttpRepository } from './features/auth/data/repositories/auth-http.repository';
import { AuthStore } from './features/auth/store/auth.store';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(appRoutes),
    {
      provide: API_BASE_URL,
      useFactory: () => 'https://fitness.elevateegy.com/api/v1',
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthHttpRepository,
    },
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      return authStore.initSession();
    }),
  ],
};
