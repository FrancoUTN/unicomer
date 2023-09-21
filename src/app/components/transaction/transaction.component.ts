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
  transactionAmount = new FormControl(
    { value: '', disabled: true });
  amountErrors: any = {
    required: false,
    invalid: false,
    tooLow: false,
    tooHigh: false,
    notEnoughBalance: false,
  };
  transactionData: any;
  strAmount: string = '';
  // Balance
	balance: number|any;
	strBalance: string = '...';
	balanceIsSet: boolean = false;
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
    // First operations
    this.onLoad();
  }

  setTransactionType() {
    switch (this.router.url) {
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
  }

  async onLoad() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      if (this.transactionType === 'transfer') {
        this.otherUsers = await this.userService.getEveryOtherUser();
      } else {
        await this.setupAmount();
      }
    } catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
    this.isLoading = false;
  }

  async setupAmount() {
    await this.getBalance();
    this.transactionAmount.valueChanges.subscribe(this.validateInput);
  }

  async getBalance() {
    this.balance = await this.transactionService.getCurrentUserBalance();
    const strBalance = this.balance.toString();
    this.strBalance = strBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    this.balanceIsSet = true;
    return;
  }

  // Observer.
  // Needs to be an arrow function in order to preserve "this" context
  validateInput = (value: string | null) => {
    // Reset errors
    this.amountErrors.required = false
    this.amountErrors.invalid = false;
    this.amountErrors.tooLow = false;
    this.amountErrors.tooHigh = false;
    if (
      this.transactionType === 'transfer' ||
      this.transactionType === 'withdrawal'
    ) {
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
      else if (amount > 50000) {
        this.amountErrors.tooHigh = true;
      }
      if (
        this.transactionType === 'transfer' ||
        this.transactionType === 'withdrawal'
      ) {
        if (amount > this.balance) {
          this.amountErrors.notEnoughBalance = true;
        }
      }
    }
  }

  async onUserClick(user: any) {
    this.selectedUser = user;
    if (this.balanceIsSet) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.setupAmount();
    }
    catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
    this.isLoading = false;
  }
  
  onGoBackClick() {
    // Back to users list
    this.transactionAmount.reset();
    this.selectedUser = null;
  }

  onContinueClick() {
    // Next page
    this.isConfirmSection = true;
    if (this.transactionAmount.value) {
      this.strAmount = this.transactionAmount.value
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
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
    else {
      transactionData = await this.transactionService.depositOrWithdrawMoney(
        Number(this.transactionAmount.value),
        this.transactionType);
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
        receiver: transactionData.receiver,
        sender: transactionData.sender,
        type: transactionData.type,
      };
    }
    else {
      formattedData = {
        amount: formattedAmount,
        date: formattedDate,
        type: transactionData.type,
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
    this.balanceIsSet = false;
    this.onLoad();
    // Go back to the first page    
    if (this.transactionType === 'transfer') {
      this.selectedUser = null;
    }
    this.isSummarySection = false;
  }
}
