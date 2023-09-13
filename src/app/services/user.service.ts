import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc
} from '@angular/fire/firestore';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private usersRef = collection(this.firestore, 'users');

  constructor(private authService: AuthService) { }

  async getCurrentUserID() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user');
    }
    return currentUser.uid;
  }

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
      const user: any = docSnap.data();
      user.id = uid;
      return user;
    }
  }

  async getEveryOtherUser() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user');
    }
    // As it orders based in ASCII (I think), we should force
    // uppercase names at signup (and, potentially, in profile editing)
    const q = query(
      this.usersRef,
      orderBy('firstName', 'asc')
    );
    const qsUsers = await getDocs(q);
    const otherUsers: Array<any> = [];
    qsUsers.forEach(qdsUser => {
      if (qdsUser.id !== currentUser.uid) {
        const user = qdsUser.data();
        user.id = qdsUser.id;
        otherUsers.push(user);
      }
    });
    return otherUsers;
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
      documentNumber: Number(formValue.documentNumber),
      documentType: formValue.documentType,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      profilePictureURL
    });
  }
}
