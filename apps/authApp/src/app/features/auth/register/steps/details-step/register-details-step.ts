import { Component, computed, inject, input } from '@angular/core';
import { DynamicForm, FieldConfig } from '@org/ui';
import { AuthFeedback } from '../../../ui/auth-feedback/auth-feedback';
import { REGISTER_STEPPER } from '../../register-stepper';

/**
 * A plain "fill in these fields" step. Used for the registration steps that
 * have no dedicated design yet; each one is configured in `register-steps.ts`.
 */
@Component({
  selector: 'app-register-details-step',
  imports: [DynamicForm, AuthFeedback],
  template: `
    <h2 class="auth-title">{{ heading() }}</h2>

    <app-auth-feedback [errors]="stepper.errors()" />

    <lib-dynamic-form
      class="auth-form"
      [fields]="fields()"
      [initialData]="stepper.draft()"
      [submitting]="stepper.submitting()"
      [disableSubmitWhenInvalid]="false"
      [submitLabel]="stepper.isLast() ? 'Create Account' : 'Next'"
      loadingLabel="Creating account..."
      (formSubmit)="stepper.next($event)"
    >
      <p formAfterSubmit class="auth-footnote">
        <button type="button" class="auth-link" (click)="stepper.back()">
          Back
        </button>
        <span class="auth-step-count">{{ progress() }}</span>
      </p>
    </lib-dynamic-form>
  `,
  styleUrls: ['../../../ui/auth-form.css', '../../../ui/auth-page.css'],
})
export class RegisterDetailsStep {
  protected readonly stepper = inject(REGISTER_STEPPER);

  heading = input.required<string>();
  fields = input.required<FieldConfig[]>();

  protected readonly progress = computed(
    () => `${this.stepper.index() + 1} / ${this.stepper.count()}`
  );
}
