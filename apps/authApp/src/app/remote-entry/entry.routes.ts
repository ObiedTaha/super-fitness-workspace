import { Route } from '@angular/router';
import { AUTH_ROUTES } from '../features/auth/auth.routes';
import { provideAuth } from '../features/auth/auth.providers';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [provideAuth()],
    children: AUTH_ROUTES,
  },
];

