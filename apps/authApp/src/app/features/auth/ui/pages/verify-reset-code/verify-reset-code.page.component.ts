import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-verify-reset-code-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: ''
})
export class VerifyResetCodePageComponent {
  private readonly authStore = inject(AuthStore);

  readonly loading$ = this.authStore.loading$;

  readonly form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    resetCode: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authStore
      .verifyResetCode({
        email: this.form.getRawValue().email,
        resetCode: this.form.getRawValue().resetCode,
      })
      .subscribe();
  }
}
