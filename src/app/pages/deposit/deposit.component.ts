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
	isLoading: boolean = false;
  errorMessage: string = '';
  transactionAmount = new FormControl('');
  amountErrors: any = {
    required: false,
    invalid: false,
    tooLow: false,
  };
	balance: number|any;
	strBalance: string = '...';
  isConfirmSection: boolean = false;
  isSummarySection: boolean = false;
  transactionData: any;

  constructor(
    private transactionService: TransactionService,
    private router: Router) { }

  async ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.onLoad();
      this.isLoading = false;
    } catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
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
      const balance = await this.transactionService.getCurrentUserBalance();
      this.isLoading = false;
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
      throw error;
    }
  }

  onContinueClick() {
    this.isConfirmSection = true;
  }

  onCancelClickHandler() {
    this.isConfirmSection = false;
    this.errorMessage = '';
  }
  
  async onConfirmClickHandler() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const transactionData = await this.transactionService.depositMoney(
        Number(this.transactionAmount.value));
      this.isConfirmSection = false;
      this.isSummarySection = true;
      this.setTransactionData(transactionData);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        this.errorMessage = error.message;
      }
    }
    this.isLoading = false;
  }

  setTransactionData(transactionData: any) {
    // Amount
    const strAmount = String(transactionData.amount);
    const formattedAmount = strAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Date
    const serverTimestamp: Timestamp = transactionData.date;
    const serverDate = serverTimestamp.toDate();
    const serverDateJS = dayjs(serverDate);
    const formattedDate = serverDateJS.format('DD/MM/YYYY - HH:mm:ss');

    this.transactionData = {
      amount: formattedAmount,
      date: formattedDate,
    };
  }

  onNewTransactionClick() {
    // Reset properties
    this.transactionAmount.reset();
    this.balance = null;
    this.strBalance = '...';
    this.transactionData = null;
    this.onLoad();
    // Go back to first page
    this.isSummarySection = false;
  }

  onGoHomeClick() {
    this.router.navigate(['/home']);
  }
}
