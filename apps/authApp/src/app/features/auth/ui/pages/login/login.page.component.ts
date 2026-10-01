import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-shell">
      <section class="auth-card" aria-labelledby="login-title">
        <div class="brand-block">
          <span class="brand-mark">S</span>
          <span class="brand-name">SUPER FITNESS</span>
        </div>

        <h1 id="login-title">Welcome back</h1>
        <p class="subtitle">Sign in to continue your training plan.</p>

        @if (error$ | async; as error) {
          <p class="error-message" role="alert">{{ error }}</p>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label class="field">
            <span>Email</span>
            <input type="email" formControlName="email" placeholder="you@example.com" />
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <small>Enter a valid email address.</small>
            }
          </label>

          <label class="field">
            <span>Password</span>
            <input type="password" formControlName="password" placeholder="••••••••" />
            @if (form.controls.password.invalid && form.controls.password.touched) {
              <small>Password is required.</small>
            }
          </label>

          <div class="row between">
            <label class="checkbox">
              <input type="checkbox" formControlName="remember" />
              <span>Remember me</span>
            </label>

            <a routerLink="/auth/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" [disabled]="(loading$ | async) ?? false">
            {{ (loading$ | async) ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="footer-text">
          Need an account?
          <a routerLink="/auth/register">Create one</a>
        </p>
      </section>
    </main>
  `,
  styles: `
    :host { display: block; }
    * { box-sizing: border-box; }
    .auth-shell {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px 16px;
      background: linear-gradient(135deg, #eef8f3 0%, #f6f3ef 100%);
      font-family: 'Segoe UI', sans-serif;
      color: #1f2a24;
    }
    .auth-card {
      width: min(100%, 430px);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(24, 58, 46, 0.08);
      border-radius: 18px;
      box-shadow: 0 24px 50px rgba(22, 48, 38, 0.12);
      padding: 28px 24px 22px;
    }
    .brand-block { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
    .brand-mark {
      display: grid;
      place-items: center;
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: #1f6a4f;
      color: #fff;
      font-weight: 700;
    }
    .brand-name { font-size: 11px; letter-spacing: 0.12em; font-weight: 700; color: #34614d; }
    h1 { margin: 0; font-size: clamp(2rem, 4vw, 2.5rem); }
    .subtitle { margin: 8px 0 22px; color: #5c6b64; }
    form { display: grid; gap: 18px; }
    .field { display: grid; gap: 8px; color: #2d4038; font-weight: 600; }
    .field span { font-size: 0.92rem; }
    .field input {
      width: 100%;
      border: 1px solid #d9dfdb;
      border-radius: 12px;
      min-height: 46px;
      padding: 0 14px;
      font: inherit;
      background: #fff;
    }
    .field input:focus { outline: 2px solid rgba(31, 106, 79, 0.15); border-color: #2c795d; }
    .field small { color: #b33d2d; font-weight: 500; }
    .row { display: flex; align-items: center; }
    .between { justify-content: space-between; }
    .checkbox { display: inline-flex; align-items: center; gap: 8px; color: #466359; font-size: 0.9rem; }
    .checkbox input { accent-color: #1f6a4f; }
    a { color: #1d6a50; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    button {
      border: none;
      border-radius: 12px;
      min-height: 48px;
      font: inherit;
      font-weight: 700;
      background: linear-gradient(135deg, #1f6a4f, #2e7d60);
      color: #fff;
      cursor: pointer;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    button:hover:not(:disabled) { transform: translateY(-1px); }
    button:disabled { opacity: 0.7; cursor: wait; }
    .error-message {
      margin: 0 0 16px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #fdecea;
      color: #9d2e1f;
      font-size: 0.9rem;
    }
    .footer-text { margin: 18px 0 0; text-align: center; color: #5c6b64; }
  `,
})
export class LoginPageComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading$ = this.authStore.loading$;
  readonly error$ = this.authStore.error$;

  readonly form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    remember: new FormControl(false, { nonNullable: true }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.form.getRawValue();

    this.authStore.signIn({ email, password }, remember).subscribe({
      next: () => {
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        void this.router.navigateByUrl(returnUrl);
      },
    });
  }
}
