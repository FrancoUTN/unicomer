import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() { }

  getAuth(): Auth {
    return this.auth;
  }
  
  getCurrentUser() {
    return this.getAuth().currentUser
  }

  getAuthState() {
    return authState(this.auth);
  }
}
