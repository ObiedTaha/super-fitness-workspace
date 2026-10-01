import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api/api.tokens';
import { AuthRepository, AuthRequestError } from './auth.repository';
import { AuthResponse, SigninRequest, SignupRequest } from './auth.models';

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;
const SIGNIN_URL = `${BASE_URL}/auth/signin`;

const signupPayload: SignupRequest = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  gender: 'female',
  password: 'Passw0rd!',
  rePassword: 'Passw0rd!',
  goal: 'get fitter',
  height: 170,
  weight: 62,
  age: 36,
  activityLevel: 'level3',
};

const signinPayload: SigninRequest = {
  email: 'ada@example.com',
  password: 'Passw0rd!',
};

const success: AuthResponse = {
  message: 'success',
  token: 'a-token',
  user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
};

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        AuthRepository,
      ],
    });

    repository = TestBed.inject(AuthRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('signup', () => {
    it('POSTs the payload to /auth/signup', () => {
      repository.signup(signupPayload).subscribe();

      const request = http.expectOne(SIGNUP_URL);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(signupPayload);
      request.flush(success);
    });

    it('passes a successful response through untouched', () => {
      let received: AuthResponse | undefined;
      repository.signup(signupPayload).subscribe((value) => (received = value));

      http.expectOne(SIGNUP_URL).flush(success);
      expect(received).toEqual(success);
    });

    it('turns the API validation string into one message per problem', () => {
      let error: AuthRequestError | undefined;
      repository.signup(signupPayload).subscribe({
        error: (e: AuthRequestError) => (error = e),
      });

      http.expectOne(SIGNUP_URL).flush(
        { error: '"email" must be a valid email,"age" is required' },
        { status: 400, statusText: 'Bad Request' }
      );

      expect(error).toBeInstanceOf(AuthRequestError);
      expect(error?.status).toBe(400);
      expect(error?.messages).toEqual([
        '"email" must be a valid email',
        '"age" is required',
      ]);
      // The Error's own message surfaces the first problem.
      expect(error?.message).toBe('"email" must be a valid email');
    });
  });

  describe('signin', () => {
    it('POSTs only the credentials to /auth/signin', () => {
      repository.signin(signinPayload).subscribe();

      const request = http.expectOne(SIGNIN_URL);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(signinPayload);
      request.flush(success);
    });

    it('returns the token and user on success', () => {
      let received: AuthResponse | undefined;
      repository.signin(signinPayload).subscribe((value) => (received = value));

      http.expectOne(SIGNIN_URL).flush(success);
      expect(received?.token).toBe('a-token');
      expect(received?.user.email).toBe('ada@example.com');
    });

    it('reports the API wording for a 401 rather than a generic message', () => {
      let error: AuthRequestError | undefined;
      repository.signin(signinPayload).subscribe({
        error: (e: AuthRequestError) => (error = e),
      });

      http
        .expectOne(SIGNIN_URL)
        .flush(
          { error: 'incorrect email or password' },
          { status: 401, statusText: 'Unauthorized' }
        );

      expect(error?.status).toBe(401);
      expect(error?.messages).toEqual(['incorrect email or password']);
    });
  });

  it('reports a reachability problem when the request never lands', () => {
    let error: AuthRequestError | undefined;
    repository.signin(signinPayload).subscribe({
      error: (e: AuthRequestError) => (error = e),
    });

    http
      .expectOne(SIGNIN_URL)
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown' });

    expect(error?.messages).toEqual([
      'Cannot reach the server. Check your connection.',
    ]);
  });

  it('falls back to a status-based message for an unparseable body', () => {
    let error: AuthRequestError | undefined;
    repository.signup(signupPayload).subscribe({
      error: (e: AuthRequestError) => (error = e),
    });

    http
      .expectOne(SIGNUP_URL)
      .flush(null, { status: 502, statusText: 'Bad Gateway' });

    expect(error?.messages).toEqual(['Request failed (502). Please try again.']);
  });
});
