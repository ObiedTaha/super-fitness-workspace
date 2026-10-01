import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AUTH_REPOSITORY } from './domain/repositories/auth-repository.token';
import { AuthRepository } from './domain/repositories/auth.repository';
import { TokenStorage } from './domain/token-storage';
import { AuthHttpRepository } from './data/repositories/auth-http.repository';
import { TokenStorageService } from './services/token-storage.service';

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AuthRepository, useClass: AuthHttpRepository },
    { provide: AUTH_REPOSITORY, useExisting: AuthRepository },
    { provide: TokenStorage, useExisting: TokenStorageService },
  ]);
}
