import { FieldConfig } from '@org/ui';
import {
  ACTIVITY_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  LOGIN_FIELDS,
  REGISTER_ACCOUNT_FIELDS,
  REGISTER_BODY_FIELDS,
  REGISTER_GOAL_FIELDS,
  REGISTER_PROFILE_FIELDS,
} from './auth.fields';

const ALL_REGISTER_FIELDS: FieldConfig[] = [
  ...REGISTER_ACCOUNT_FIELDS,
  ...REGISTER_PROFILE_FIELDS,
  ...REGISTER_BODY_FIELDS,
  ...REGISTER_GOAL_FIELDS,
];

function byKey(fields: FieldConfig[], key: string): FieldConfig {
  const field = fields.find((f) => f.key === key);
  if (!field) throw new Error(`No field configured for "${key}"`);
  return field;
}

function check(field: FieldConfig, value: unknown, model: Record<string, unknown> = {}) {
  return field.validate?.(value, model) ?? null;
}

describe('LOGIN_FIELDS', () => {
  it('asks only for the credentials the design shows', () => {
    expect(LOGIN_FIELDS.map((f) => f.key)).toEqual(['email', 'password']);
  });

  it('keeps labels available to screen readers behind the placeholder-only design', () => {
    for (const field of LOGIN_FIELDS) {
      expect(field.label, field.key).toBeTruthy();
      expect(field.hideLabel, field.key).toBe(true);
    }
  });

  it('lets password managers fill an existing account', () => {
    expect(byKey(LOGIN_FIELDS, 'password').autocomplete).toBe('current-password');
  });
});

describe('REGISTER_ACCOUNT_FIELDS (step 1)', () => {
  it('holds exactly the four fields of the design, in its order', () => {
    expect(REGISTER_ACCOUNT_FIELDS.map((f) => f.key)).toEqual([
      'firstName',
      'lastName',
      'email',
      'password',
    ]);
  });

  it('stacks them one per row, as drawn', () => {
    expect(REGISTER_ACCOUNT_FIELDS.every((f) => f.row === undefined)).toBe(true);
  });

  it('asks password managers to suggest a new password', () => {
    expect(byKey(REGISTER_ACCOUNT_FIELDS, 'password').autocomplete).toBe('new-password');
  });
});

describe('register step fields together', () => {
  /** Exactly the keys POST /api/v1/auth/signup reports as required. */
  const REQUIRED_BY_API = [
    'firstName',
    'lastName',
    'email',
    'gender',
    'password',
    'rePassword',
    'goal',
    'height',
    'weight',
    'age',
    'activityLevel',
  ];

  it('cover every key the signup endpoint requires (rePassword is derived by step 1)', () => {
    expect([...ALL_REGISTER_FIELDS.map((f) => f.key), 'rePassword'].sort()).toEqual(
      [...REQUIRED_BY_API].sort()
    );
  });

  it('never ask for the same key on two steps', () => {
    const keys = ALL_REGISTER_FIELDS.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('are all required', () => {
    for (const field of ALL_REGISTER_FIELDS) {
      expect(field.required, field.key).toBe(true);
    }
  });

  it('send the numeric fields as numbers', () => {
    for (const key of ['age', 'height', 'weight']) {
      expect(byKey(ALL_REGISTER_FIELDS, key).type, key).toBe('number');
    }
  });

  it('offer only the enum values the API accepts', () => {
    expect(GENDER_OPTIONS.map((o) => o.value)).toEqual(['male', 'female']);
    expect(ACTIVITY_LEVEL_OPTIONS.map((o) => o.value)).toEqual([
      'level1',
      'level2',
      'level3',
      'level4',
      'level5',
    ]);
  });

  describe('validation', () => {
    it('rejects a malformed email', () => {
      const email = byKey(ALL_REGISTER_FIELDS, 'email');
      expect(check(email, 'ada@example.com')).toBeNull();
      expect(check(email, 'not-an-email')).toBe('Enter a valid email address.');
    });

    it('enforces the API password pattern', () => {
      const password = byKey(ALL_REGISTER_FIELDS, 'password');
      expect(check(password, 'Passw0rd!')).toBeNull();
      expect(check(password, 'weakpass')).toContain('At least 8 characters');
    });

    it('holds the numeric fields to a plausible range', () => {
      const age = byKey(ALL_REGISTER_FIELDS, 'age');
      expect(check(age, 30)).toBeNull();
      expect(check(age, 3)).toContain('between 10 and 120');

      const height = byKey(ALL_REGISTER_FIELDS, 'height');
      expect(check(height, 175)).toBeNull();
      expect(check(height, 12)).toContain('between 80 and 260');

      const weight = byKey(ALL_REGISTER_FIELDS, 'weight');
      expect(check(weight, 70)).toBeNull();
      expect(check(weight, 900)).toContain('between 25 and 400');
    });

    it('requires a real name rather than a single character', () => {
      const firstName = byKey(ALL_REGISTER_FIELDS, 'firstName');
      expect(check(firstName, 'Ada')).toBeNull();
      expect(check(firstName, 'A')).toBe('Must be at least 2 characters.');
    });
  });
});
