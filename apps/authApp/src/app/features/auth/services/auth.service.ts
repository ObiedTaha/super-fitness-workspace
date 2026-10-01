import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/data-access/api-response';
import { ApiService } from '../../../shared/data-access/api-service';
import { Message } from '../../../shared/data-access/message';

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  goal: string;
  activityLevel: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  signIn(payload: SignInRequest): Observable<ApiResponse<AuthSession>> {
    return this.post<SignInRequest, ApiResponse<AuthSession>>('auth/signin', payload);
  }

  signUp(payload: SignUpRequest): Observable<ApiResponse<Message>> {
    return this.post<SignUpRequest, ApiResponse<Message>>('auth/signup', payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiResponse<Message>> {
    return this.post<ForgotPasswordRequest, ApiResponse<Message>>('auth/forgotPassword', payload);
  }

  verifyResetCode(payload: VerifyResetCodeRequest): Observable<ApiResponse<Message>> {
    return this.post<VerifyResetCodeRequest, ApiResponse<Message>>('auth/verifyResetCode', payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiResponse<Message>> {
    return this.put<ResetPasswordRequest, ApiResponse<Message>>('auth/resetPassword', payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse<Message>> {
    return this.patch<ChangePasswordRequest, ApiResponse<Message>>('auth/change-password', payload);
  }

  loadProfile(): Observable<ApiResponse<AuthUser>> {
    return this.get<ApiResponse<AuthUser>>('auth/profile-data');
  }

  logout(): Observable<ApiResponse<Message>> {
    return this.get<ApiResponse<Message>>('auth/logout');
  }
}
