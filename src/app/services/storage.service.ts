import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage = inject(Storage);

  constructor() { }

  async uploadUserProfilePicture(file: File, uid: string) {
    // Uploads user image to 'users' folder
    const storageRef = ref(this.storage, `users/${uid}`);
    const uploadResult = await uploadBytes(storageRef, file);
    // Retrieves URL to be saved in the DB with user's data
    return getDownloadURL(uploadResult.ref);
  }
}
