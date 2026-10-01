import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DynamicForm } from '@org/ui';
import { REGISTER_ACCOUNT_FIELDS } from '../../../data/auth.fields';
import { AuthFeedback } from '../../../ui/auth-feedback/auth-feedback';
import { SocialSignIn } from '../../../ui/social-sign-in/social-sign-in';
import { REGISTER_STEPPER, RegistrationDraft } from '../../register-stepper';

/**
 * Step 1 of registration: the account itself — name, email and password,
 * as in the design.
 */
@Component({
  selector: 'app-register-account-step',
  imports: [DynamicForm, AuthFeedback, SocialSignIn, RouterLink],
  templateUrl: './register-account-step.html',
  styleUrls: ['../../../ui/auth-form.css', '../../../ui/auth-page.css'],
})
export class RegisterAccountStep {
  protected readonly stepper = inject(REGISTER_STEPPER);
  protected readonly fields = REGISTER_ACCOUNT_FIELDS;

  /** For the links that are part of the design but not wired to a flow yet. */
  protected readonly notice = signal<string | null>(null);

  protected onSubmit(values: RegistrationDraft): void {
    this.notice.set(null);
    // The design has no confirmation field (the eye toggle lets people check
    // what they typed), but the API still requires `rePassword`.
    this.stepper.next({ ...values, rePassword: values['password'] });
  }


}
