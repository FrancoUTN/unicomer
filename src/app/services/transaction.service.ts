import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  and,
  collection,
  getDoc,
  getDocs,
  or,
  orderBy,
  query,
  serverTimestamp,
  where
} from '@angular/fire/firestore';
import * as dayjs from 'dayjs';

import { AuthService } from './auth.service';
import { UserService } from './user.service';

type Dayjs = dayjs.Dayjs;

interface Day {
  date: Dayjs,
  dayIncome: number,
  dayOutcome: number
}

interface TransferUser {
  firstName: string,
  id: string,
  lastName: string,
}

interface Transaction {
  amount: number,
  date: Timestamp,
  receiver?: TransferUser,
  sender?: TransferUser,
  type: string,
  user?: string
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private firestore: Firestore = inject(Firestore);
  private transactionsRef = collection(this.firestore, 'transactions');

  constructor(
    private authService: AuthService,
    private userService: UserService) { }

  private queryCurrentUserTransactions() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user to query')
    }
    const uid = currentUser.uid
    return query(
      this.transactionsRef,
      or(
        where('user', '==', uid),
        where('receiver.id', '==', uid),
        where('sender.id', '==', uid)
      ),
      orderBy('date', 'asc')
    )
  }

  private getCurrentUserTransactions() {
    const q = this.queryCurrentUserTransactions();
		return getDocs(q);
  }

  async loadCurrentUserTransactionsArray(transactionsArray: Array<any>) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user to calculate balance');
    }
    const qsTransactions = await this.getCurrentUserTransactions();
    
    qsTransactions.forEach(qdsTransaction => {
      const transaction = qdsTransaction.data();
      const transactionDate = dayjs(transaction.date.toDate());
      let isIncome: boolean = false;
      let displayType: string = 'N/A';
      
      switch (transaction.type) {
        case 'transfer':
            displayType = 'Transferencia';
            let otherUser: any;
            if (transaction.sender.id === currentUser.uid) {
              otherUser = transaction.receiver;
              isIncome = false;
            }
            else if (transaction.receiver.id === currentUser.uid) {
              otherUser = transaction.sender;
              isIncome = true;
            }
            else {
              throw new Error('Transfer not related to the user');
            }
            transaction.otherUserFullName = `
              ${otherUser.firstName} ${otherUser.lastName}
            `;
          break;
        case 'deposit':
          displayType = 'Depósito';
          isIncome = true;
          break;
        case 'loan':
          displayType = 'Préstamo';
          isIncome = true;
          break;
        case 'payment':
          displayType = 'Pago';
          isIncome = false;
          break;
        case 'withdrawal':
          displayType = 'Extracción';
          isIncome = false;
          break;
        default:
          throw new Error('Transaction with unknown type');
      }
      transaction.isIncome = isIncome;
      transaction.displayType = displayType;
      transaction.displayAmount = String(transaction.amount).replace(
        /\B(?=(\d{3})+(?!\d))/g, "."
      );
      transaction.displayDate = transactionDate.format('DD MMM, YYYY');
      transaction.displayTime = transactionDate.format('hh:mm:ss A');
      transaction.displayMobile = transactionDate.format('DD/MM');
      transactionsArray.unshift(transaction);
    });
    return;
  }

  async getCurrentUserBalance() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user');
    }
    const q = this.queryCurrentUserTransactions()
		const qsTransactions = await getDocs(q);
    let accuBalance: number = 0;
    qsTransactions.forEach(qdsTransaction => {
      const transaction = qdsTransaction.data();
      if (transaction.type === 'transfer') {
        if (transaction.sender.id === currentUser.uid) {
          accuBalance -= transaction.amount;
        }
        else if (transaction.receiver.id === currentUser.uid) {
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
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user');
    }
    const q = this.queryCurrentUserTransactions();
		const qsTransactions = await getDocs(q);
    let accuTotalBalance: number = 0;
    // const days: Day[] = [];
    const days: number[] = [];
    let daysIndex = 0;
    let actualDay: any;
    qsTransactions.forEach(qdsTransaction => {
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
        if (transaction.sender.id === currentUser.uid) {
          accuTotalBalance -= transactionAmount;
        }
        else if (transaction.receiver.id === currentUser.uid) {
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
    if (actualDay) {
      while (!actualDay.isSame(dayjs(), 'day')) {
        days[daysIndex] = accuTotalBalance;
        daysIndex++;
        actualDay = actualDay.add(1, 'day');
      }
    }
    // One last time for today:
    days[daysIndex] = accuTotalBalance;
    return days;
  }

  // Income-outcome
  private queryTransactionsFromDate(date: Timestamp) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user');
    }
    const uid = currentUser.uid;
    return query(this.transactionsRef,
      and(
        or(
          where('user', '==', uid),
          where('receiver.id', '==', uid),
          where('sender.id', '==', uid)
        ),
        where('date', '>=', date)
      ),
      orderBy('date', 'asc')
    );
  }

  async getCurrentUserIncomeAndOutcome() {
    const lastMonthDays: Array<Day> = [];
    const thisMonthDays: Array<Day> = [];
    const today: Dayjs = dayjs();
    const firstDayOfLastMonth: Dayjs = today.subtract(1, 'month').startOf('month');
    let iteratingDate: Dayjs = firstDayOfLastMonth;
    let k = 0;

    while(iteratingDate.month() !== today.month()) {
      lastMonthDays[k] = {
        date: iteratingDate,
        dayIncome: 0,
        dayOutcome: 0
      };
      iteratingDate = iteratingDate.add(1, 'day');
      k++;
    }

    k = 0;

    while(iteratingDate.date() <= today.date()) {
      thisMonthDays[k] = {
        date: iteratingDate,
        dayIncome: 0,
        dayOutcome: 0
      };
      iteratingDate = iteratingDate.add(1, 'day');
      k++;
    }

    const timestamp = Timestamp.fromMillis(firstDayOfLastMonth.valueOf());
    const q = this.queryTransactionsFromDate(timestamp);
    const qs = await getDocs(q);
    const lastMonthTransactions: Array<Transaction> = [];
    const thisMonthTransactions: Array<Transaction> = [];
    
    qs.forEach(transactionSnapshot => {
      const transaction = transactionSnapshot.data() as Transaction;
      const serverTimestamp: Timestamp = transaction.date;
      const serverDate: Date = serverTimestamp.toDate();
      const serverDateJS = dayjs(serverDate);

      if (serverDateJS.isSame(today, 'month')) {
        thisMonthTransactions.push(transaction);
      }
      else if (serverDateJS.isSame(firstDayOfLastMonth, 'month')) {
        lastMonthTransactions.push(transaction);
      }
      else {
        console.log('Error: something went wrong with the transactions query.');
      }
    });

    this.loadMonthDaysArray(lastMonthDays, lastMonthTransactions);
    this.loadMonthDaysArray(thisMonthDays, thisMonthTransactions);

    return {
      lastMonthDays,
      thisMonthDays
    };
  }

  loadMonthDaysArray(monthDays: Array<Day>, transactions: Array<Transaction>) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('There\'s no current user to load month days array.');
    }
    let accuDayIncome: number, accuDayOutcome: number;
    let i = 0;

    for (const day of monthDays) {
      if (!transactions[i]) {
        break;
      }
      accuDayIncome = 0;
      accuDayOutcome = 0;

      while (transactions[i]) {
        const serverTimestamp: Timestamp = transactions[i].date;
        const serverDate: Date = serverTimestamp.toDate();
        let serverDateJS = dayjs(serverDate);
    
        if (day.date.isSame(serverDateJS, 'day')) {
          const amount = Number(transactions[i].amount);          
          switch (transactions[i].type) {
            case 'transfer':
                if (transactions[i].sender?.id === currentUser.uid) {
                  accuDayOutcome += amount;
                }
                else if (transactions[i].receiver?.id === currentUser.uid) {
                  accuDayIncome += amount;
                }
                else {
                  throw new Error('Transfer not related to the user');
                }
              break;
            case 'deposit':
              accuDayIncome += amount;
              break;
            case 'loan':
              accuDayIncome += amount;
              break;
            case 'payment':
              accuDayOutcome += amount;
              break;
            case 'withdrawal':
              accuDayOutcome += amount;
              break;
            default:
              throw new Error('Transaction with unknown type');
          }
          i++;
        }
        else {
          break;
        }
      }
      day.dayIncome = accuDayIncome;
      day.dayOutcome = accuDayOutcome;
    }
  }

  async addTransaction(newTransaction: any) {
    const docRef = await addDoc(this.transactionsRef, newTransaction);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  async transferMoney(amount: number, receiver: any) {
    const currentUser = await this.userService.getCurrentUserData();
    const customSender: TransferUser = {   
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      id: currentUser.id,
    };
    const customReceiver: TransferUser = {
      firstName: receiver.firstName,
      lastName: receiver.lastName,
      id: receiver.id,
    };
    const newTransaction = {
      amount,
      // // AUXILIAR TESTING! REPLACE IN PRODUCTION
      date: serverTimestamp(),
      // date: this.testDate(),
      // //
      receiver: customReceiver,
      sender: customSender,
      type: 'transfer',
    };
    return this.addTransaction(newTransaction);
  }
  
  async depositOrWithdrawMoney(amount: number, type: string) {
    const currentUserID = await this.userService.getCurrentUserID();
    const newTransaction = {
      amount,
      // // AUXILIAR TESTING! REPLACE IN PRODUCTION
      date: serverTimestamp(),
      // date: this.testDate(),
      // //
      user: currentUserID,
      type,
    };
    return this.addTransaction(newTransaction);
  }

  // TESTING
  testDate() {
    let day = dayjs();
    // // Alter these for testing purposes:
    day = day.subtract(1, 'month');
    day = day.subtract(2, 'day');
    // //
    const fakeDate = day.toDate();
    return Timestamp.fromDate(fakeDate);
  }
}
