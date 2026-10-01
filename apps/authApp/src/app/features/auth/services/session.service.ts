import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly expiredSubject = new Subject<void>();

  readonly expired$ = this.expiredSubject.asObservable();

  expire(): void {
    this.expiredSubject.next();
  }
}
