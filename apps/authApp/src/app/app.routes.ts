import { Route } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
