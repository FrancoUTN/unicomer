import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  transactionType: string = "";
  // Asynchronism
	isLoading: boolean = false;
  errorMessage: string = '';
  // Transaction
  transactionAmount = new FormControl({ value: '', disabled: true });
  amountErrors: any = {
    required: false,
    invalid: false,
    tooLow: false,
  };
  transactionData: any;
  // Balance
	balance: number|any;
	strBalance: string = '...';
  // Flow control
  isConfirmSection: boolean = false;
  isSummarySection: boolean = false;
  // Other user(s)
  otherUsers: Array<any> = [];
  selectedUser: any = null;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    // Set transaction type based on URL
    this.setTransactionType();
  }

  setTransactionType() {
    // TODO: Create observer rather than this function
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      switch (currentUrl) {
        case '/transfer':
          this.transactionType = 'transfer';
          break;
        case '/deposit':
          this.transactionType = 'deposit';
          break;
        case '/withdrawal':
          this.transactionType = 'withdrawal';
          break;
      }
      // First operations (fix this)
      this.onLoad();
    });
  }

  async onLoad() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      if (this.transactionType === 'transfer') {
        this.otherUsers = await this.userService.getEveryOtherUser();
        // this.isLoading = false;
      }
      await this.getBalance();
      this.setInputValidations();
    } catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
    this.isLoading = false;
  }

  async getBalance() {
    this.balance = await this.transactionService.getCurrentUserBalance();
    const strBalance = this.balance.toString();
    this.strBalance = strBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return;
  }

  setInputValidations() {
    // TODO: Create observer rather than this function
    this.transactionAmount.valueChanges.subscribe(value => {
      // Reset errors
      this.amountErrors.required = false
      this.amountErrors.invalid = false;
      this.amountErrors.tooLow = false;
      if (this.transactionType === 'transfer') {
        this.amountErrors.notEnoughBalance = false;
      }
      // Set errors
      if (!value) {
        this.amountErrors.required = true;
      }
      else {
        const onlyNumbersRegexp = /^\d+$/;
        if (!onlyNumbersRegexp.test(value)) {
          this.amountErrors.invalid = true;
        }
        const amount = Number(value);
        if (amount <= 0) {
          this.amountErrors.tooLow = true;
        }
        if (this.transactionType === 'transfer') {
          if (amount > this.balance) {
            this.amountErrors.notEnoughBalance = true;
          }
        }
      }
    });
  }

  async onUserClick(user: any) {
    this.selectedUser = user;
  }

  onContinueClick() {
    // Next page
    this.isConfirmSection = true;
  }

  onCancelClick() {
    // Previous page
    this.isConfirmSection = false;
  }
  
  async onConfirmClick() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      // Save transaction in database and get it's info back
      await this.setTransactionData();
      // Go to next page
      this.isConfirmSection = false;
      this.isSummarySection = true;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        this.errorMessage = error.message;
      }
    }
    this.isLoading = false;
  }

  async setTransactionData() {
    let transactionData;
    if (this.transactionType === 'transfer') {
      if (!this.selectedUser) {
        throw new Error('No user selected.')
      }
      transactionData = await this.transactionService.transferMoney(
        Number(this.transactionAmount.value),
        this.selectedUser);
    }
    else if (this.transactionType === 'deposit') {
      transactionData = await this.transactionService.depositMoney(
        Number(this.transactionAmount.value));
    }
    this.transactionData = this.formatTransactionData(transactionData);
  }

  formatTransactionData(transactionData: any) {
    // Format amount
    const strAmount = String(transactionData.amount);
    const formattedAmount = strAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Format date
    const serverTimestamp: Timestamp = transactionData.date;
    const serverDate = serverTimestamp.toDate();
    const serverDateJS = dayjs(serverDate);
    const formattedDate = serverDateJS.format('DD/MM/YYYY - HH:mm:ss');
    // Set property with formatted data
    let formattedData;
    if (this.transactionType === 'transfer') {
      formattedData = {
        amount: formattedAmount,
        date: formattedDate,
        sender: transactionData.sender,
        receiver: transactionData.receiver,
      };
    }
    else if (this.transactionType === 'deposit') {
      formattedData = {
        amount: formattedAmount,
        date: formattedDate,
      };
    }
    return formattedData;
  }

  onGoHomeClick() {
    this.router.navigate(['/home']);
  }

  onRestartClick() {
    // Reset everything
    this.transactionAmount.reset();
    this.transactionData = null;
    this.balance = null;
    this.strBalance = '...';
    this.onLoad();
    // Go back to the first page    
    if (this.transactionType === 'transfer') {
      this.selectedUser = null;
    }
    this.isSummarySection = false;

  }
}