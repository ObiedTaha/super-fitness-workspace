import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivityLevel,
  AuthRepository,
  AuthRequestError,
  AuthResponse,
  AuthSession,
  AuthenticatedUser,
  Gender,
  SigninRequest,
  SignupRequest,
} from '@super-fitness/data-access-user';

/**
 * Narrows the dynamic form's untyped model into the signup payload.
 *
 * The form's field keys are declared to match the API one-for-one
 * (see `auth.fields.ts`), so this is a cast with coercion rather than a
 * rename: `p-inputnumber` can still hand back a string for empty-ish input.
 */
export function toSignupRequest(model: Record<string, unknown>): SignupRequest {
  return {
    firstName: String(model['firstName'] ?? '').trim(),
    lastName: String(model['lastName'] ?? '').trim(),
    email: String(model['email'] ?? '').trim(),
    gender: model['gender'] as Gender,
    password: String(model['password'] ?? ''),
    rePassword: String(model['rePassword'] ?? ''),
    goal: String(model['goal'] ?? ''),
    height: Number(model['height']),
    weight: Number(model['weight']),
    age: Number(model['age']),
    activityLevel: model['activityLevel'] as ActivityLevel,
  };
}

export function toSigninRequest(model: Record<string, unknown>): SigninRequest {
  return {
    email: String(model['email'] ?? '').trim(),
    password: String(model['password'] ?? ''),
  };
}

/** Owns the request state for one auth page. Provided per component. */
@Injectable()
export class AuthFacade {
  private readonly repository = inject(AuthRepository);
  private readonly session = inject(AuthSession);

  private readonly _submitting = signal(false);
  private readonly _errors = signal<string[]>([]);
  private readonly _user = signal<AuthenticatedUser | null>(null);

  readonly submitting = this._submitting.asReadonly();
  readonly errors = this._errors.asReadonly();
  /** The user returned by the last successful request, if any. */
  readonly user = this._user.asReadonly();

  /** @returns whether the request was started (false if one is already running). */
  signup(model: Record<string, unknown>): boolean {
    return this.run(() => this.repository.signup(toSignupRequest(model)));
  }

  signin(model: Record<string, unknown>): boolean {
    return this.run(() => this.repository.signin(toSigninRequest(model)));
  }

  clearErrors(): void {
    this._errors.set([]);
  }

  /**
   * Takes a factory rather than an observable so nothing is built — and no
   * payload mapped — for a submit that the in-flight guard turns away.
   */
  private run(request: () => Observable<AuthResponse>): boolean {
    if (this._submitting()) return false;

    this._submitting.set(true);
    this._errors.set([]);

    request().subscribe({
      next: (response) => {
        this.session.save(response);
        this._user.set(response.user);
        this._submitting.set(false);
      },
      error: (error: unknown) => {
        this._errors.set(
          error instanceof AuthRequestError
            ? error.messages
            : ['Something went wrong. Please try again.']
        );
        this._submitting.set(false);
      },
    });

    return true;
  }
}
