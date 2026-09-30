import { isDevMode } from '@angular/core';
import { Route } from '@angular/router';
import { TodosPageComponent } from '../features/todos/ui/pages/todos-page.component';

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
