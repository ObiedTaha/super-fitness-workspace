import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiClient } from '../api/api-client';
import {
  AuthErrorBody,
  AuthResponse,
  AuthenticatedUser,
  SigninRequest,
  SignupRequest,
  parseAuthError,
} from './auth.models';

/** Thrown for any non-2xx auth response, with the messages already parsed. */
export class AuthRequestError extends Error {
  constructor(
    readonly messages: string[],
    readonly status: number
  ) {
    super(messages[0] ?? 'Something went wrong. Please try again.');
    this.name = 'AuthRequestError';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthRepository extends ApiClient<AuthenticatedUser> {
  protected readonly endpoint = 'auth';

  /** POST {baseUrl}/auth/signup */
  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.post$('signup', payload);
  }

  /** POST {baseUrl}/auth/signin */
  signin(payload: SigninRequest): Observable<AuthResponse> {
    return this.post$('signin', payload);
  }

  private post$(
    action: 'signup' | 'signin',
    payload: SignupRequest | SigninRequest
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.resourceUrl}/${action}`, payload)
      .pipe(catchError((error) => throwError(() => this.toAuthError(error))));
  }

  private toAuthError(error: unknown): AuthRequestError {
    if (!(error instanceof HttpErrorResponse)) {
      return new AuthRequestError(['Unexpected error. Please try again.'], 0);
    }

    const messages = parseAuthError(error.error as AuthErrorBody);

    if (messages.length) {
      return new AuthRequestError(messages, error.status);
    }

    // Network failures and gateway errors arrive with no parseable body.
    return new AuthRequestError(
      [
        error.status === 0
          ? 'Cannot reach the server. Check your connection.'
          : `Request failed (${error.status}). Please try again.`,
      ],
      error.status
    );
  }
}
