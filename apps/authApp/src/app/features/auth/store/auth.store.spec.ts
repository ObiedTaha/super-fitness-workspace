import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from './auth.store';
import { TokenStorageService } from '../services/token-storage.service';

describe('AuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        TokenStorageService,
        provideRouter([]),
      ],
    });
  });

  it('starts unauthenticated', () => {
    const store = TestBed.inject(AuthStore);

    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('stores a user after a successful sign in', () => {
    const store = TestBed.inject(AuthStore);
    const user = {
      _id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      gender: 'female',
      age: 36,
      height: 170,
      weight: 62,
      goal: 'stay-fit',
      activityLevel: 'level3',
    };

    store.setUser(user);

    expect(store.currentUser).toEqual(user);
    expect(store.isAuthenticated()).toBe(true);
  });
});
