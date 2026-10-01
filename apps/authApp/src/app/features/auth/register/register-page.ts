import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthHeader } from '@org/ui';
import { AuthFacade } from '../auth.facade';
import {
  REGISTER_STEPPER,
  RegisterStepper,
  RegistrationDraft,
  keysInErrors,
} from './register-stepper';
import { REGISTER_STEPS } from './register-steps';

const NO_INPUTS: Record<string, unknown> = {};

/**
 * The registration flow. It owns the draft and the step position, renders the
 * current step (from `REGISTER_STEPS`) inside the auth card, and submits the
 * merged draft through the existing `AuthFacade.signup` after the last step.
 *
 * Steps talk to it through `REGISTER_STEPPER`, which this component provides.
 */
@Component({
  selector: 'app-register-page',
  imports: [AuthHeader, NgComponentOutlet, RouterLink],
  providers: [
    AuthFacade,
    { provide: REGISTER_STEPPER, useExisting: forwardRef(() => RegisterPage) },
  ],
  templateUrl: './register-page.html',
  styleUrls: ['../ui/auth-form.css', '../ui/auth-page.css'],
})
export class RegisterPage implements RegisterStepper {
  private readonly facade = inject(AuthFacade);
  protected readonly steps = inject(REGISTER_STEPS);

  private readonly _draft = signal<RegistrationDraft>({});
  private readonly _index = signal(0);

  readonly draft = this._draft.asReadonly();
  readonly index = this._index.asReadonly();
  readonly count = computed(() => this.steps.length);
  readonly isFirst = computed(() => this._index() === 0);
  readonly isLast = computed(() => this._index() === this.steps.length - 1);
  readonly submitting = this.facade.submitting;
  readonly errors = this.facade.errors;

  protected readonly user = this.facade.user;
  protected readonly step = computed(() => this.steps[this._index()]);
  protected readonly stepInputs = computed(() => this.step().inputs ?? NO_INPUTS);
  protected readonly eyebrow = computed(() =>
    this.user()
      ? 'All Set'
      : (this.step().eyebrow ?? `Step ${this._index() + 1} of ${this.steps.length}`)
  );
  protected readonly title = computed(() =>
    this.user() ? 'Welcome Aboard' : this.step().title
  );

  constructor() {
    // When the API rejects a field from an earlier step (e.g. "email" is
    // taken), take the user back to the step where they can fix it.
    effect(() => {
      const keys = keysInErrors(this.facade.errors());
      if (!keys.length) return;

      const owner = this.steps.findIndex((s) => s.keys.some((k) => keys.includes(k)));
      if (owner >= 0 && owner !== untracked(this._index)) this._index.set(owner);
    });
  }

  next(values: RegistrationDraft): void {
    this._draft.update((draft) => ({ ...draft, ...values }));

    if (this.isLast()) {
      this.facade.signup(this._draft());
      return;
    }

    this.facade.clearErrors();
    this._index.update((i) => i + 1);
  }

  back(): void {
    if (this.isFirst()) return;
    this.facade.clearErrors();
    this._index.update((i) => i - 1);
  }
}
