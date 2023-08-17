import { Component, inject } from '@angular/core';
import { Firestore, collection, getDocs, or, orderBy, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent {
  private firestore: Firestore = inject(Firestore);
	userBalance: number | any
	uid: string = '2aTT5FhH9uXcbWqw963aSRJOkG82'

  ngOnInit() {
    this.algo()
  }

	algo() {
    const transactionsRef = collection(this.firestore, 'transactions');
		const q = query(
      transactionsRef,
      or(
        where('user', '==', this.uid),
        where('receiver', '==', this.uid),
        where('sender', '==', this.uid)
      ),
			orderBy('date', 'asc'))
		getDocs(q).then(qsTransactions => {
			let accuBalance: number = 0
			qsTransactions.forEach(qdsTransaction => {
				const transaction = qdsTransaction.data()
				if (transaction.type === 'transfer') {
					if (transaction.sender === this.uid) {
						accuBalance -= transaction.amount
					}
					else if (transaction.receiver === this.uid) {
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
		}).then((accuBalance: number) => {
			this.userBalance = accuBalance
		})
	}
}
