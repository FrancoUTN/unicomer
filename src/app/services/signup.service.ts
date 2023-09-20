import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService) { }

  async signUp(formData: any, profilePicture: File) {
    // Throws an error if the user already exists
    const userExists = await this.userService.checkDocumentAlreadyInUse(
      formData.documentType, Number(formData.documentNumber));
    if (userExists) {
      throw new Error('El documento ya ha sido registrado.');
    }

    // Creates authentication instance
    const uc = await this.authService.signUpWithEmailAndPassword(
      formData.email,
      formData.passwordRepeat
    );
    const userID = uc.user.uid;

    // Uploads user image to Fire Storage and retrieves it's URL
    const profilePictureURL = await this.storageService.uploadUserProfilePicture(
      profilePicture, userID
    );
    
    // Creates user document in the database
    return this.userService.createUser(formData, userID, profilePictureURL);
  }
}
