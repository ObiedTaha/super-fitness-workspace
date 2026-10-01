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
  templateUrl: ''
})
export class RegisterPageComponent {
  private readonly authStore = inject(AuthStore);
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
