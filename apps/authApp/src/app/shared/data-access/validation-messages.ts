export const validationMessages = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  minLength: (min: number) => `Minimum length is ${min} characters.`,
  maxLength: (max: number) => `Maximum length is ${max} characters.`,
} as const;

export type ValidationMessageKey = keyof typeof validationMessages;

export function getValidationMessage(
  key: ValidationMessageKey,
  value?: number | string
): string {
  const message = validationMessages[key];

  if (typeof message === 'function') {
    return message(Number(value ?? 0));
  }

  return message;
}
