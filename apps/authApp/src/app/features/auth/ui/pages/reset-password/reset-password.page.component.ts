import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.page.component.html',
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
    h1 { margin: 0; font-size: clamp(2rem, 4vw, 2.4rem); }
    .subtitle { margin: 8px 0 22px; color: #5c6b64; }
    form { display: grid; gap: 18px; }
    .field { display: grid; gap: 8px; color: #2d4038; font-weight: 600; }
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
    .error-message {
      margin: 0 0 16px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #fdecea;
      color: #9d2e1f;
      font-size: 0.9rem;
    }
    button {
      border: none;
      border-radius: 12px;
      min-height: 48px;
      font: inherit;
      font-weight: 700;
      background: linear-gradient(135deg, #1f6a4f, #2e7d60);
      color: #fff;
      cursor: pointer;
    }
    button:disabled { opacity: 0.7; cursor: wait; }
  `,
})
export class ResetPasswordPageComponent {
  readonly authStore = inject(AuthStore);

  readonly loading$ = this.authStore.loading$;

  readonly form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    newPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authStore
      .resetPassword({
        email: this.form.getRawValue().email,
        newPassword: this.form.getRawValue().newPassword,
      })
      .subscribe();
  }
}
