/**
 * Contracts for the auth endpoints, mirrored from the backend's Joi schemas.
 *
 * - POST /api/v1/auth/signup
 * - POST /api/v1/auth/signin
 */

export type Gender = 'male' | 'female';

/** The backend grades activity on a 1-5 scale rather than named tiers. */
export type ActivityLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  password: string;
  rePassword: string;
  goal: string;
  height: number;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: Gender;
  photo?: string;
}

/** Both endpoints answer with the same envelope. */
export interface AuthResponse {
  message: string;
  token: string;
  user: AuthenticatedUser;
}

/** @deprecated Kept for callers written against the signup-only name. */
export type SignupResponse = AuthResponse;

/**
 * The API returns problems as a single comma-joined string under `error`,
 * e.g. `"email" must be a valid email,"age" is required`, or a plain sentence
 * such as `incorrect email or password`.
 */
export interface AuthErrorBody {
  error?: string;
  message?: string;
}

/** At least 8 chars with an upper, a lower, a digit and a symbol. */
export const PASSWORD_PATTERN =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

/** Splits the API's comma-joined `error` string into one message per problem. */
export function parseAuthError(body: AuthErrorBody | null | undefined): string[] {
  const raw = body?.error ?? body?.message;
  if (!raw) return [];

  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}
