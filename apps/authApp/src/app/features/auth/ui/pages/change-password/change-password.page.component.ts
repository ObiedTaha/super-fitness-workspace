import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: ''
})
export class ChangePasswordPageComponent {
  private readonly authStore = inject(AuthStore);

  readonly loading$ = this.authStore.loading$;

  readonly form = new FormGroup({
    oldPassword: new FormControl('', { validators: [Validators.required], nonNullable: true }),
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
      .changePassword({
        oldPassword: this.form.getRawValue().oldPassword,
        newPassword: this.form.getRawValue().newPassword,
      })
      .subscribe();
  }
}
