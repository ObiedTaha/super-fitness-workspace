import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../../config/api-base-url.token';
import { SessionService } from '../../../features/auth/services/session.service';
import { TokenStorageService } from '../../../features/auth/services/token-storage.service';

const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgotPassword',
  '/auth/verifyResetCode',
  '/auth/resetPassword',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const sessionService = inject(SessionService);
  const apiBaseUrl = inject(API_BASE_URL);
  const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
    req.url.includes(endpoint)
  );
  const isApiRequest = req.url.startsWith(apiBaseUrl);

  if (!isApiRequest || isPublicAuthRequest) {
    return next(req);
  }

  const token = tokenStorage.get();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        tokenStorage.clear();
        sessionService.expire();
      }

      return throwError(() => error);
    })
  );
};
