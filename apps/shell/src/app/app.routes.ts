import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  // Auth is the landing experience: "/" drops straight into the login screen.
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'superFitness',
    loadChildren: () =>
      loadRemote<typeof import('superFitness/Routes')>(
        'superFitness/Routes',
      ).then((remote) => {
        if (!remote) {
          throw new Error('Unable to load superFitness routes');
        }
        return remote.remoteRoutes;
      }),
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemote<typeof import('authApp/Routes')>('authApp/Routes').then(
        (remote) => {
          if (!remote) {
            throw new Error('Unable to load authApp routes');
          }
          return remote.remoteRoutes;
        },
      ),
  },
  { path: '**', redirectTo: 'auth' },
];
