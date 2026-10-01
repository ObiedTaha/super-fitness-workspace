import { Observable } from 'rxjs';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyResetCodeRequest,
} from '../models/auth-requests.model';
import { MessageResult, SignInResult } from '../models/auth-results.model';
import { User } from '../models/user.model';

export interface AuthRepository {
  signIn(request: SignInRequest): Observable<SignInResult>;
  signUp(request: SignUpRequest): Observable<MessageResult>;
  forgotPassword(request: ForgotPasswordRequest): Observable<MessageResult>;
  verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResult>;
  resetPassword(request: ResetPasswordRequest): Observable<MessageResult>;
  changePassword(request: ChangePasswordRequest): Observable<MessageResult>;
  loadProfile(): Observable<User>;
  logout(): Observable<MessageResult>;
}
