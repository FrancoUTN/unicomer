import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authService: AuthService,
    private userService: UserService) { }

  async logIn(formData: any) {
    const docType = formData.documentType;
    const docNumber = Number(formData.documentNumber);
    const email = await this.userService
      .getEmailByDocument(docType, docNumber);

    return this.authService.loginWithEmailAndPassword(
      email, formData.password);
  }
}
