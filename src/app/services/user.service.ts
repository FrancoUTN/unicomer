import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private usersRef = collection(this.firestore, 'users');

  constructor(private authService: AuthService) { }

  async getCurrentUserData() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user');
    }
    const uid = currentUser.uid;
    const docRef = doc(this.usersRef, uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('User document doesn\'t exist');
    } else {
      return docSnap.data();
    }
  }

  async getUserById(uid: string) {
    const docRef = doc(this.usersRef, uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('User document doesn\'t exist');
    } else {
      return docSnap.data();
    }    
  }

  async createUser(formValue: any, uid: string, profilePictureURL: string) {
    // It uses Firebase Authentication's automatically-generated user id
    // as document id, and also saves it's image, which is hosted by
    // Firebase Storage to a public url
    return setDoc(doc(this.firestore, 'users', uid), {
      documentType: formValue.documentType,
      documentNumber: Number(formValue.documentNumber),
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      profilePictureURL
    });
  }
}
