import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, or, orderBy, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import * as dayjs from 'dayjs';

interface Day {
  date: Date,
  dayBalance: number
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private firestore: Firestore = inject(Firestore);
  private transactionsRef = collection(this.firestore, 'transactions');
  private currentUser = this.authService.getCurrentUser()

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

  async getCurrentUserBalance() {
    const q = this.queryCurrentUserTransactions()
		const qsTransactions = await getDocs(q);
    let accuBalance: number = 0;
    qsTransactions.forEach(qdsTransaction => {
      if (!this.currentUser) {
        throw new Error('There\'s no current user to calculate balance');
      }
      const transaction = qdsTransaction.data();
      if (transaction.type === 'transfer') {
        if (transaction.sender === this.currentUser.uid) {
          accuBalance -= transaction.amount;
        }
        else if (transaction.receiver === this.currentUser.uid) {
          accuBalance += transaction.amount;
        }
        else {
          throw new Error('Transfer not related to the user');
        }
      }
      else if (transaction.type === 'deposit' || transaction.type === 'loan') {
        accuBalance += transaction.amount;
      }
      else if (transaction.type === 'payment' || transaction.type === 'withdrawal') {
        accuBalance -= transaction.amount;
      }
      else {
        throw new Error('Transaction with unknown type');
      }
    });
    return accuBalance;
  }

  async getCurrentUserBalanceHistory() {
    const q = this.queryCurrentUserTransactions();
		const qsTransactions = await getDocs(q);
    let accuTotalBalance: number = 0;
    // const days: Day[] = [];
    const days: number[] = [];
    let daysIndex = 0;
    let actualDay: any;
    qsTransactions.forEach(qdsTransaction => {
      if (!this.currentUser) {
        throw new Error('There\'s no current user to calculate balance history');
      }
      const transaction = qdsTransaction.data();
      const transactionDate = dayjs(transaction.date.toDate());
      const transactionAmount = Number(transaction.amount);
      const transactionType = transaction.type;

      // One-time initialization
      if (!actualDay) {
        actualDay = transactionDate;
      }

      while (!actualDay.isSame(transactionDate, 'day')) {
        days[daysIndex] = accuTotalBalance;
        daysIndex++;
        actualDay = actualDay.add(1, 'day');
      }

      if (transactionType === 'transfer') {
        if (transaction.sender === this.currentUser.uid) {
          accuTotalBalance -= transactionAmount;
        }
        else if (transaction.receiver === this.currentUser.uid) {
          accuTotalBalance += transactionAmount;
        }
        else {
          throw new Error('Transfer not related to the user');
        }
      }
      else if (transactionType === 'deposit' || transactionType === 'loan') {
        accuTotalBalance += transactionAmount;
      }
      else if (transactionType === 'payment' || transactionType === 'withdrawal') {
        accuTotalBalance -= transactionAmount;
      }
      else {
        throw new Error('Transaction with unknown type');
      }
    });
    days[daysIndex] = accuTotalBalance;
    return days;
  }

}
