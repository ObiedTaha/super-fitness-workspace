import { Routes } from '@angular/router';

import { ChangePasswordPageComponent } from './ui/pages/change-password/change-password.page.component';
import { ForgotPasswordPageComponent } from './ui/pages/forgot-password/forgot-password.page.component';
import { LoginPageComponent } from './ui/pages/login/login.page.component';
import { RegisterPageComponent } from './ui/pages/register/register.page.component';
import { ResetPasswordPageComponent } from './ui/pages/reset-password/reset-password.page.component';
import { VerifyResetCodePageComponent } from './ui/pages/verify-reset-code/verify-reset-code.page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
  },
  {
    path: 'verify-reset-code',
    component: VerifyResetCodePageComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordPageComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

export const authRoutes = AUTH_ROUTES;
