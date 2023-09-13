import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
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

  constructor(
    private transactionService: TransactionService,
    private router: Router) { }

  ngOnInit() {
    this.onLoad();
  }

  setBalanceProperties(balance: number) {
    this.balance = balance;
    const strBalance = balance.toString();
    this.strBalance = strBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  async onLoad() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      // Balance setting
      const balance = await this.transactionService.getCurrentUserBalance();
      this.setBalanceProperties(balance);
      // Input validation
      this.transactionAmount.valueChanges.subscribe(value => {
        this.amountErrors.required = false
        this.amountErrors.invalid = false;
        this.amountErrors.tooLow = false;
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
        }
      });
    } catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
    this.isLoading = false;
  }

  onContinueClick() {
    // Next page
    this.isConfirmSection = true;
  }

  onCancelClickHandler() {
    // Previous page
    this.isConfirmSection = false;
  }
  
  async onConfirmClickHandler() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      // Save transaction in database and get it's info back
      const transactionData = await this.transactionService.depositMoney(
        Number(this.transactionAmount.value));
      this.setTransactionData(transactionData);
      // Next page
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

  setTransactionData(transactionData: any) {
    // Format amount
    const strAmount = String(transactionData.amount);
    const formattedAmount = strAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Format date
    const serverTimestamp: Timestamp = transactionData.date;
    const serverDate = serverTimestamp.toDate();
    const serverDateJS = dayjs(serverDate);
    const formattedDate = serverDateJS.format('DD/MM/YYYY - HH:mm:ss');
    // Set property with formatted data
    this.transactionData = {
      amount: formattedAmount,
      date: formattedDate,
    };
  }

  onNewTransactionClick() {
    // Reset everything
    this.transactionAmount.reset();
    this.transactionData = null;
    this.balance = null;
    this.strBalance = '...';
    this.onLoad();
    // Go back to the first page
    this.isSummarySection = false;
  }

  onGoHomeClick() {
    this.router.navigate(['/home']);
  }
}
