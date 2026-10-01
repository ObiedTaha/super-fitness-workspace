import {
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { extractError } from '../../../core/utils/http-error.util';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyResetCodeRequest,
} from '../domain/models/auth-requests.model';
import { MessageResult, SignInResult } from '../domain/models/auth-results.model';
import { User } from '../domain/models/user.model';
import { ChangePasswordUseCase } from '../domain/use-cases/change-password.use-case';
import { ForgotPasswordUseCase } from '../domain/use-cases/forgot-password.use-case';
import { LoadProfileUseCase } from '../domain/use-cases/load-profile.use-case';
import { LogoutUseCase } from '../domain/use-cases/logout.use-case';
import { ResetPasswordUseCase } from '../domain/use-cases/reset-password.use-case';
import { SignInUseCase } from '../domain/use-cases/sign-in.use-case';
import { SignUpUseCase } from '../domain/use-cases/sign-up.use-case';
import { VerifyResetCodeUseCase } from '../domain/use-cases/verify-reset-code.use-case';
import { SessionService } from '../services/session.service';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly router = inject(Router);
  private readonly signInUseCase = inject(SignInUseCase);
  private readonly signUpUseCase = inject(SignUpUseCase);
  private readonly forgotPasswordUseCase = inject(ForgotPasswordUseCase);
  private readonly verifyResetCodeUseCase = inject(VerifyResetCodeUseCase);
  private readonly resetPasswordUseCase = inject(ResetPasswordUseCase);
  private readonly changePasswordUseCase = inject(ChangePasswordUseCase);
  private readonly loadProfileUseCase = inject(LoadProfileUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly sessionService = inject(SessionService);

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly user$: Observable<User | null> = this.userSubject.asObservable();
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();
  readonly error$: Observable<string | null> = this.errorSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map((user) => user !== null),
    distinctUntilChanged()
  );

  private readonly authenticatedSignal = signal(false);
  readonly isAuthenticated: Signal<boolean> = this.authenticatedSignal.asReadonly();

  private readonly userWritable = signal<User | null>(null) as WritableSignal<
    User | null
  >;

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  constructor() {
    this.sessionService.expired$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.clearSession();
    });
  }

  setUser(user: User | null): void {
    this.userSubject.next(user);
    this.authenticatedSignal.set(user !== null);
    this.userWritable.set(user);
    this.errorSubject.next(null);
  }

  clearSession(): void {
    this.tokenStorage.clear();
    this.userSubject.next(null);
    this.authenticatedSignal.set(false);
    this.userWritable.set(null);
    this.errorSubject.next(null);
  }

  signIn(
    request: SignInRequest,
    remember = false
  ): Observable<SignInResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.signInUseCase.execute(request).pipe(
      map((result) => {
        this.tokenStorage.save(result.token, remember);
        this.setUser(result.user);
        return result;
      }),
      catchError((error: unknown) => {
        const message = extractError(error);
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  signUp(request: SignUpRequest): Observable<MessageResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.signUpUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<MessageResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.forgotPasswordUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.verifyResetCodeUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.resetPasswordUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<MessageResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.changePasswordUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.errorSubject.next(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  async initSession(): Promise<void> {
    const token = this.tokenStorage.get();

    if (!token) {
      this.clearSession();
      return;
    }

    this.loadingSubject.next(true);

    try {
      const user = await firstValueFrom(
        this.loadProfileUseCase.execute().pipe(
          map((profileUser) => {
            this.setUser(profileUser);
            return profileUser;
          }),
          catchError(() => {
            this.clearSession();
            return of(null);
          })
        )
      );

      if (!user) {
        this.clearSession();
      }
    } finally {
      this.loadingSubject.next(false);
    }
  }

  logout(): Observable<MessageResult> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.logoutUseCase.execute().pipe(
      catchError(() => of({ message: 'Logged out' })),
      map((result) => {
        this.clearSession();
        void this.router.navigate(['/auth/login']);
        return result;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
}
