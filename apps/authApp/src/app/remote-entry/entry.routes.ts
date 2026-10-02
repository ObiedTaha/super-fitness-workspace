import { isDevMode } from '@angular/core';
import { Route } from '@angular/router';

/**
 * Exposed to the shell as `authApp/Routes` and reused by this app's own
 * standalone bootstrap, so the paths stay relative to wherever it is mounted
 * (`/auth/login` in the shell, `/login` on its own dev server).
 */
export const remoteRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'Login | Super Fitness',
    loadComponent: () =>
      import('../features/auth/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    title: 'Register | Super Fitness',
    loadComponent: () =>
      import('../features/auth/register/register-page').then(
        (m) => m.RegisterPage
      ),
  },
  {
    path: 'todos',
    title: 'Todos | Super Fitness',
    loadComponent: () =>
      import('../features/todos/ui/pages/todos-page.component').then(
        (m) => m.TodosPageComponent
      ),
  },
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