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
