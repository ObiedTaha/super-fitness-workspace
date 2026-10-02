import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const rePassword = control.get('rePassword')?.value;

  return password && rePassword && password !== rePassword
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.component.html',
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
      width: min(100%, 620px);
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
    h1 { margin: 0; font-size: clamp(2rem, 4vw, 2.5rem); }
    .subtitle { margin: 8px 0 22px; color: #5c6b64; }
    form { display: grid; gap: 18px; }
    .split-grid { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .field { display: grid; gap: 8px; color: #2d4038; font-weight: 600; }
    .field span { font-size: 0.92rem; }
    .field input, .field select {
      width: 100%;
      border: 1px solid #d9dfdb;
      border-radius: 12px;
      min-height: 46px;
      padding: 0 14px;
      font: inherit;
      background: #fff;
    }
    .field input:focus, .field select:focus { outline: 2px solid rgba(31, 106, 79, 0.15); border-color: #2c795d; }
    .inline-error, .error-message {
      margin: 0;
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
    .footer-text { margin: 18px 0 0; text-align: center; color: #5c6b64; }
    a { color: #1d6a50; text-decoration: none; font-weight: 600; }
    @media (max-width: 560px) { .split-grid { grid-template-columns: 1fr; } }
  `,
})
export class RegisterPageComponent {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly loading$ = this.authStore.loading$;

  readonly form = new FormGroup(
    {
      firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
      rePassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      gender: new FormControl<'male' | 'female'>('female', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      height: new FormControl(170, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      weight: new FormControl(65, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      age: new FormControl(25, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      goal: new FormControl('General fitness', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      activityLevel: new FormControl<'level1' | 'level2' | 'level3' | 'level4' | 'level5'>('level3', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    { validators: passwordMatchValidator }
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    this.authStore.signUp({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      gender: values.gender,
      height: values.height,
      weight: values.weight,
      age: values.age,
      goal: values.goal,
      activityLevel: values.activityLevel,
    }).subscribe({
      next: () => {
        void this.router.navigate(['/auth/login']);
      },
    });
  }
}
