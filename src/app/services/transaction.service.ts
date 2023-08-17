import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, or, orderBy, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private firestore: Firestore = inject(Firestore);
  private transactionsRef = collection(this.firestore, 'transactions');
  private currentUser = this.authService.getAuth().currentUser

  constructor(private authService: AuthService) { }

  private queryCurrentUserTransactions() {
    if (!this.currentUser) {
      throw new Error('There\'s no current user to query')
    }
    const uid = this.currentUser.uid
    return query(
      this.transactionsRef,
      or(
        where('user', '==', uid),
        where('receiver', '==', uid),
        where('sender', '==', uid)
      ),
      orderBy('date', 'asc')
    )
  }

  getCurrentUserBalance() {
    const q = this.queryCurrentUserTransactions()
		return getDocs(q).then(qsTransactions => {
			let accuBalance: number = 0
			qsTransactions.forEach(qdsTransaction => {
        if (!this.currentUser) {
          throw new Error('There\'s no current user to calculate balance')
        }
				const transaction = qdsTransaction.data()
				if (transaction.type === 'transfer') {
					if (transaction.sender === this.currentUser.uid) {
						accuBalance -= transaction.amount
					}
					else if (transaction.receiver === this.currentUser.uid) {
						accuBalance += transaction.amount
					}
					else {
						throw new Error('Transfer not related to the user')
					}
				}
				else if (transaction.type === 'deposit' || transaction.type === 'loan') {
					accuBalance += transaction.amount
				}
				else if (transaction.type === 'payment' || transaction.type === 'withdrawal') {
					accuBalance -= transaction.amount
				}
				else {
					throw new Error('Transaction with unknown type')
				}
			})
			return accuBalance
    })
  }  
}
