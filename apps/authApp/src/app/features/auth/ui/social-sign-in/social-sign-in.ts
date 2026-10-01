import { Component, output } from '@angular/core';

type Provider = 'facebook' | 'google' | 'apple';

/**
 * The "Or / social providers" row from the auth design.
 *
 * No provider SDK is wired up yet — the buttons emit `providerSelected` so the
 * host page decides what happens.
 */
@Component({
  selector: 'app-social-sign-in',
  imports: [],
  templateUrl: './social-sign-in.html',
  styleUrl: './social-sign-in.css',
})
export class SocialSignIn {
  providerSelected = output<Provider>();

  protected readonly providers: Provider[] = ['facebook', 'google', 'apple'];
}
