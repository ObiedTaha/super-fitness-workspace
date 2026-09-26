import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: 'superFitness',
    loadChildren: () =>
      loadRemote<typeof import('superFitness/Routes')>(
        'superFitness/Routes',
      ).then((m) => m!.remoteRoutes),
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemote<typeof import('authApp/Routes')>('authApp/Routes').then(
        (m) => m!.remoteRoutes,
      ),
  }
];
