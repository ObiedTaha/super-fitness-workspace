import { Component, input } from '@angular/core';

/**
 * The request feedback shown at the top of an auth card: API errors as an
 * alert list, and an optional neutral notice. Renders nothing when empty.
 */
@Component({
  selector: 'app-auth-feedback',
  template: `
    @if (errors().length) {
      <ul class="auth-errors" role="alert">
        @for (error of errors(); track error) {
          <li>{{ error }}</li>
        }
      </ul>
    }

    @if (notice()) {
      <p class="auth-notice" role="status">{{ notice() }}</p>
    }
  `,
  styleUrl: './auth-feedback.css',
})
export class AuthFeedback {
  errors = input<readonly string[]>([]);
  notice = input<string | null>(null);
}
