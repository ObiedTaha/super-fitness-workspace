import { InjectionToken, Signal, Type } from '@angular/core';

/**
 * The values collected so far, keyed like the signup payload. Every step reads
 * its own keys from here (to restore them when the user comes back) and hands
 * its new values to `next()`.
 */
export type RegistrationDraft = Record<string, unknown>;

/** One step of the registration flow. */
export interface RegisterStepDefinition {
  /** Stable id, useful for analytics and tests. */
  id: string;
  /** The intro header above the card for this step. */
  title: string;
  /** Line above the title; defaults to "Step n of N". */
  eyebrow?: string;
  /** Rendered inside the auth card. Injects `REGISTER_STEPPER` to talk to the flow. */
  component: Type<unknown>;
  /** Static inputs for `component`. */
  inputs?: Record<string, unknown>;
  /**
   * The payload keys this step owns. When the API rejects a key (its errors
   * quote them, e.g. `"email" must be a valid email`), the flow returns to the
   * step that owns it.
   */
  keys: readonly string[];
}

/**
 * What a step component can see and do. Provided by the registration flow
 * host, so a step needs no inputs or outputs to integrate:
 *
 *   private readonly stepper = inject(REGISTER_STEPPER);
 *   ...
 *   this.stepper.next({ gender, age });
 */
export interface RegisterStepper {
  readonly draft: Signal<RegistrationDraft>;
  /** Zero-based position of the step being shown. */
  readonly index: Signal<number>;
  readonly count: Signal<number>;
  readonly isFirst: Signal<boolean>;
  readonly isLast: Signal<boolean>;
  /** True while the final signup request is in flight. */
  readonly submitting: Signal<boolean>;
  readonly errors: Signal<readonly string[]>;
  /** Merges `values` into the draft, then moves on — or submits on the last step. */
  next(values: RegistrationDraft): void;
  back(): void;
}

export const REGISTER_STEPPER = new InjectionToken<RegisterStepper>(
  'REGISTER_STEPPER'
);

/** Pulls the payload keys the API quoted out of its error messages. */
export function keysInErrors(errors: readonly string[]): string[] {
  return errors.flatMap((message) =>
    [...message.matchAll(/"(\w+)"/g)].map((match) => match[1])
  );
}
