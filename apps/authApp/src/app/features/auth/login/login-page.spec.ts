import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL, AuthSession } from '@super-fitness/data-access-user';
import { DynamicForm } from '@org/ui';
import { LoginPage } from './login-page';

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';
const SIGNIN_URL = `${BASE_URL}/auth/signin`;

const credentials = { email: 'ada@example.com', password: 'Passw0rd!' };

/** Reaches the projected `lib-dynamic-form` instance inside the page. */
function findDynamicForm(fixture: ComponentFixture<LoginPage>): DynamicForm {
  const debugEl = fixture.debugElement.query(
    (node) => node.nativeElement?.nodeName?.toLowerCase() === 'lib-dynamic-form'
  );
  return debugEl.componentInstance as DynamicForm;
}

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    }).compileComponents();

    TestBed.inject(AuthSession).clear();

    fixture = TestBed.createComponent(LoginPage);
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('renders the login card from the design', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('lib-auth-header .auth-header__eyebrow')?.textContent?.trim()).toBe(
      'Hey There'
    );
    expect(root.querySelector('lib-auth-header h1')?.textContent?.trim()).toBe(
      'Welcome Back'
    );
    expect(root.querySelector('.auth-title')?.textContent?.trim()).toBe('Login');
  });

  it('asks for an email and a password, each with its leading glyph', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelectorAll('lib-text-field').length).toBe(1);
    expect(root.querySelectorAll('lib-password-field').length).toBe(1);
    expect(root.querySelectorAll('.field-icon lib-field-icon').length).toBe(2);
  });

  it('offers the three social providers and a link to register', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelectorAll('app-social-sign-in .social-button').length).toBe(3);
    expect(root.querySelector('.auth-footnote')?.textContent).toContain('Register');
  });

  it('POSTs the credentials to the signin endpoint', async () => {
    findDynamicForm(fixture).formSubmit.emit(credentials);
    await fixture.whenStable();

    const request = http.expectOne(SIGNIN_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);

    request.flush({
      message: 'success',
      token: 'a-token',
      user: { firstName: 'Ada', lastName: 'Lovelace', email: credentials.email },
    });
    await fixture.whenStable();

    expect(TestBed.inject(AuthSession).token()).toBe('a-token');
  });

  it('shows the API wording when the credentials are wrong', async () => {
    findDynamicForm(fixture).formSubmit.emit(credentials);
    await fixture.whenStable();

    http
      .expectOne(SIGNIN_URL)
      .flush(
        { error: 'incorrect email or password' },
        { status: 401, statusText: 'Unauthorized' }
      );
    await fixture.whenStable();

    const errors = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.auth-errors li')
    ).map((li) => li.textContent?.trim());

    expect(errors).toEqual(['incorrect email or password']);
    expect(TestBed.inject(AuthSession).isAuthenticated()).toBe(false);
  });

  it('says plainly which extras are not connected yet', async () => {
    expect(fixture.nativeElement.querySelector('.auth-notice')).toBeNull();

    fixture.nativeElement
      .querySelector('.auth-row-end .auth-link')
      .dispatchEvent(new Event('click'));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.auth-notice').textContent).toContain(
      'Password recovery is not connected yet'
    );
  });
});
