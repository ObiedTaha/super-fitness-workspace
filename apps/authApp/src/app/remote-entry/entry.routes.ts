import { isDevMode } from '@angular/core';
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

export const remoteRoutes: Route[] = [
  { path: '', component: TodosPageComponent },
];

if (isDevMode()) {
  remoteRoutes.push({
    path: 'layout-preview',
    loadComponent: () =>
      import('../features/auth/ui/components/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent,
      ),
  });
}
