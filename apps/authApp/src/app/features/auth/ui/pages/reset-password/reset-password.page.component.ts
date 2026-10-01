import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: ''
})
export class ResetPasswordPageComponent {
  private readonly authStore = inject(AuthStore);

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
