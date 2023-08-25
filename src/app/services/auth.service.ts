import { Injectable, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() { }

  getAuth(): Auth {
    return this.auth;
  }
  
  getCurrentUser(): User | null {
    return this.getAuth().currentUser;
  }

  getAuthState(): Observable<User | null> {
    return authState(this.auth);
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }
}
