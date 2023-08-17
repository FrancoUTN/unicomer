import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private usersRef = collection(this.firestore, 'users');
  private currentUser = this.authService.getCurrentUser()

  constructor(private authService: AuthService) { }

  getCurrentUserData() {    
    if (!this.currentUser) {
      throw new Error('There\'s no current user')
    }
    const uid = this.currentUser.uid
    const docRef = doc(this.usersRef, uid)
    return getDoc(docRef).then(docSnap => {
      if (!docSnap.exists()) {
        throw new Error('User document doesn\'t exist')
      } else {
        return docSnap.data()
      }
    })
  }
}
