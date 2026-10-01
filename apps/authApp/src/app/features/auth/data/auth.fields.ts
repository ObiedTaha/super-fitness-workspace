import { FieldConfig, SelectOption } from '@org/ui';
import { PASSWORD_PATTERN } from '@super-fitness/data-access-user';

/** Mirrors the backend enum: "gender" must be one of [male, female]. */
export const GENDER_OPTIONS: SelectOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

/** Mirrors the backend enum: "activityLevel" must be one of [level1..level5]. */
export const ACTIVITY_LEVEL_OPTIONS: SelectOption[] = [
  { label: 'Level 1 — Little or no exercise', value: 'level1' },
  { label: 'Level 2 — Light, 1-3 days a week', value: 'level2' },
  { label: 'Level 3 — Moderate, 3-5 days a week', value: 'level3' },
  { label: 'Level 4 — Hard, 6-7 days a week', value: 'level4' },
  { label: 'Level 5 — Athlete, twice a day', value: 'level5' },
];

/** `goal` is a free string server-side; these are the common presets. */
export const GOAL_OPTIONS: SelectOption[] = [
  { label: 'Gain weight', value: 'gain weight' },
  { label: 'Lose weight', value: 'lose weight' },
  { label: 'Get fitter', value: 'get fitter' },
  { label: 'Gain more flexibility', value: 'gain more flexible' },
  { label: 'Learn the basics', value: 'learn the basics' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function emailRule(value: unknown): string | null {
  return EMAIL_PATTERN.test(String(value)) ? null : 'Enter a valid email address.';
}

function passwordRule(value: unknown): string | null {
  return PASSWORD_PATTERN.test(String(value))
    ? null
    : 'At least 8 characters, with an uppercase, a lowercase, a number and a symbol.';
}

function rangeRule(min: number, max: number, unit: string) {
  return (value: unknown): string | null => {
    const n = Number(value);
    if (Number.isNaN(n)) return 'Enter a number.';
    return n >= min && n <= max ? null : `Enter a value between ${min} and ${max} ${unit}.`;
  };
}

function minLengthRule(min: number) {
  return (value: unknown): string | null =>
    String(value).trim().length >= min ? null : `Must be at least ${min} characters.`;
}

/**
 * The sign-in form. Placeholder-only to match the design, so every label is
 * kept for screen readers and hidden visually.
 */
export const LOGIN_FIELDS: FieldConfig[] = [
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Email',
    icon: 'email',
    autocomplete: 'email',
    hideLabel: true,
    required: true,
    validate: emailRule,
  },
  {
    key: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    icon: 'lock',
    autocomplete: 'current-password',
    hideLabel: true,
    required: true,
  },
];

/*
 * Registration is a multi-step flow (see register/register-steps.ts). Each
 * array below is the field set of one step; together, plus the `rePassword`
 * the account step derives, they make up the POST /api/v1/auth/signup payload.
 */

/** Step 1, exactly as in the design: one field per row, in this order. */
export const REGISTER_ACCOUNT_FIELDS: FieldConfig[] = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'First Name',
    icon: 'user',
    autocomplete: 'given-name',
    hideLabel: true,
    required: true,
    validate: minLengthRule(2),
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Last Name',
    icon: 'user',
    autocomplete: 'family-name',
    hideLabel: true,
    required: true,
    validate: minLengthRule(2),
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Email',
    icon: 'email',
    autocomplete: 'email',
    hideLabel: true,
    required: true,
    validate: emailRule,
  },
  {
    key: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    icon: 'lock',
    autocomplete: 'new-password',
    hideLabel: true,
    required: true,
    validate: passwordRule,
  },
];

export const REGISTER_PROFILE_FIELDS: FieldConfig[] = [
  {
    key: 'gender',
    type: 'select',
    label: 'Gender',
    placeholder: 'Gender',
    icon: 'gender',
    hideLabel: true,
    required: true,
    options: GENDER_OPTIONS,
  },
  {
    key: 'age',
    type: 'number',
    label: 'Age',
    placeholder: 'Age',
    icon: 'calendar',
    hideLabel: true,
    required: true,
    validate: rangeRule(10, 120, 'years'),
  },
];

export const REGISTER_BODY_FIELDS: FieldConfig[] = [
  {
    key: 'height',
    type: 'number',
    label: 'Height (cm)',
    placeholder: 'Height (cm)',
    icon: 'ruler',
    hideLabel: true,
    required: true,
    validate: rangeRule(80, 260, 'cm'),
  },
  {
    key: 'weight',
    type: 'number',
    label: 'Weight (kg)',
    placeholder: 'Weight (kg)',
    icon: 'weight',
    hideLabel: true,
    required: true,
    validate: rangeRule(25, 400, 'kg'),
  },
];

export const REGISTER_GOAL_FIELDS: FieldConfig[] = [
  {
    key: 'goal',
    type: 'select',
    label: 'Goal',
    placeholder: 'Your Goal',
    icon: 'target',
    hideLabel: true,
    required: true,
    options: GOAL_OPTIONS,
  },
  {
    key: 'activityLevel',
    type: 'select',
    label: 'Activity Level',
    placeholder: 'Activity Level',
    icon: 'activity',
    hideLabel: true,
    required: true,
    options: ACTIVITY_LEVEL_OPTIONS,
  },
];
