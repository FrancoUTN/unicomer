import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  // Asynchronism
	isLoading: boolean = false;
  errorMessage: string = '';
  // Other user(s)
  otherUsers: Array<any> = [];
  selectedUser: any;
  // Transfer
  transferAmount = new FormControl('');
  amountErrors: any = {
    required: false,
    invalid: false,
    tooLow: false,
    notEnoughBalance: false,
  };
  transferData: any;
  // Balance
	balance: number|any;
	strBalance: string = '...';
  // Flow control
  isConfirmSection: boolean = false;
  isSummarySection: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private router: Router) { }

  async ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.otherUsers = await this.userService.getEveryOtherUser();
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

  async onUserClick(user: any) {
    this.isLoading = true;
    this.errorMessage = '';
    this.selectedUser = user;
    try {
      const balance = await this.transactionService.getCurrentUserBalance();
      this.isLoading = false;
      this.setBalanceProperties(balance);
      // Input validation
      this.transferAmount.valueChanges.subscribe(value => {
        this.amountErrors.required = false
        this.amountErrors.invalid = false;
        this.amountErrors.tooLow = false;
        this.amountErrors.notEnoughBalance = false;
        if (!value) {
          this.amountErrors.required = true;
        }
        else {
          const onlyNumbersRegexp = /^\d+$/;
          if (!onlyNumbersRegexp.test(value)) {
            this.amountErrors.invalid = true;
          }
          const amount = Number(value);
          if (amount > this.balance) {
            this.amountErrors.notEnoughBalance = true;
          }
          if (amount <= 0) {
            this.amountErrors.tooLow = true;
          }
        }
      });
    } catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
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
      // Save transfer in database and get it's info back
      const transferData = await this.transactionService.transferMoney(
        Number(this.transferAmount.value),
        this.selectedUser);
      this.setTransferData(transferData);
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

  setTransferData(transferData: any) {
    // Format amount
    const strAmount = String(transferData.amount);
    const formattedAmount = strAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Format date
    const serverTimestamp: Timestamp = transferData.date;
    const serverDate = serverTimestamp.toDate();
    const serverDateJS = dayjs(serverDate);
    const formattedDate = serverDateJS.format('DD/MM/YYYY - HH:mm:ss');
    // Set property with formatted data
    this.transferData = {
      amount: formattedAmount,
      date: formattedDate,
      sender: transferData.sender,
      receiver: transferData.receiver,
    };
  }

  onNewTransferClick() {
    // Reset everything
    this.transferAmount.reset();
    this.transferData = null;
    this.balance = null;
    this.strBalance = '...';
    // Go back to users list
    this.selectedUser = null;
    this.isSummarySection = false;
  }

  onGoHomeClick() {
    this.router.navigate(['/home']);
  }
}
