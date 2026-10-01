import { Component, input } from '@angular/core';

export type AuthHeaderAlign = 'start' | 'center';

/**
 * The intro block above an auth form: an optional eyebrow line, the title and
 * an optional subtitle, e.g.
 *
 *   <lib-auth-header eyebrow="Hey There" title="Create An Account" />
 *   <lib-auth-header title="Forgot Password?"
 *                    subtitle="Enter your email and we'll send you a code." />
 *
 * Content slots:
 *   - `[authHeaderMedia]` renders above the text (an icon or illustration)
 *   - the default slot renders below it (extra copy, a link, a step indicator)
 *
 * Colours and sizes are read from CSS custom properties so each app can theme
 * it without reaching into its markup:
 *   --lib-auth-header-color, --lib-auth-header-muted, --lib-auth-header-gap,
 *   --lib-auth-header-eyebrow-size, --lib-auth-header-eyebrow-weight,
 *   --lib-auth-header-title-size, --lib-auth-header-title-weight,
 *   --lib-auth-header-letter-spacing
 */
@Component({
  selector: 'lib-auth-header',
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css',
  host: {
    '[class.auth-header--start]': 'align() === "start"',
  },
})
export class AuthHeader {
  title = input.required<string>();
  eyebrow = input<string>();
  subtitle = input<string>();
  align = input<AuthHeaderAlign>('center');
  /**
   * The title is the page's main heading by default. Pass 2 when the header
   * sits under another h1 (e.g. inside a dialog or a multi-step page).
   */
  headingLevel = input<1 | 2>(1);
}
