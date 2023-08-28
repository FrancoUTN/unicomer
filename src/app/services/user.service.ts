import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';

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
}
