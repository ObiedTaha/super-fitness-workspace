import { Injectable, computed, signal } from '@angular/core';
import { AuthResponse, AuthenticatedUser } from './auth.models';

const TOKEN_KEY = 'super-fitness.token';
const USER_KEY = 'super-fitness.user';

/** Reads/writes are wrapped because storage throws in private-mode browsers. */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the session still works for this page load.
  }
}

/** Holds the signed-in user for the lifetime of the app, surviving reloads. */
@Injectable({ providedIn: 'root' })
export class AuthSession {
  private readonly _token = signal<string | null>(read(TOKEN_KEY));
  private readonly _user = signal<AuthenticatedUser | null>(readUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  save(response: AuthResponse): void {
    this._token.set(response.token);
    this._user.set(response.user);

    write(TOKEN_KEY, response.token);
    write(USER_KEY, JSON.stringify(response.user));
  }

  clear(): void {
    this._token.set(null);
    this._user.set(null);

    write(TOKEN_KEY, null);
    write(USER_KEY, null);
  }
}

function readUser(): AuthenticatedUser | null {
  const raw = read(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
}
