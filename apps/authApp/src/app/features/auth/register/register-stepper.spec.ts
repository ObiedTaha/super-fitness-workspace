import { keysInErrors } from './register-stepper';
import { DEFAULT_REGISTER_STEPS } from './register-steps';

describe('keysInErrors', () => {
  it('pulls the quoted payload keys out of the API messages', () => {
    expect(
      keysInErrors(['"email" must be a valid email', '"age" is required,"height" too'])
    ).toEqual(['email', 'age', 'height']);
  });

  it('finds nothing in plain-sentence errors', () => {
    expect(keysInErrors(['incorrect email or password'])).toEqual([]);
  });
});

describe('DEFAULT_REGISTER_STEPS', () => {
  it('starts with the account step from the design', () => {
    expect(DEFAULT_REGISTER_STEPS[0].id).toBe('account');
    expect(DEFAULT_REGISTER_STEPS[0].title).toBe('Create An Account');
    expect(DEFAULT_REGISTER_STEPS[0].eyebrow).toBe('Hey There');
  });

  it('gives every step a distinct id', () => {
    const ids = DEFAULT_REGISTER_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lets exactly one step own each payload key', () => {
    const keys = DEFAULT_REGISTER_STEPS.flatMap((s) => s.keys);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
