import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthStore, SessionRedirect, authInterceptor, provideAuth } from './features/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAuth(),
    provideAppInitializer(() => {
      inject(SessionRedirect);
      return inject(AuthStore).restoreSession();
    }),
  ],
};
