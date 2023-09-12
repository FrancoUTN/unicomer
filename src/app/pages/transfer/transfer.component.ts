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
	isLoading: boolean = false;
  errorMessage: string = '';
  otherUsers: Array<any> = [];
  selectedUser: any;
  transferAmount = new FormControl('');
  notEnoughBalanceError: boolean = false;
  transferAmountNotDefinedError: boolean = true;
  invalidTransferAmountError: boolean = false;
	balance: number|any;
	strBalance: string = '...';
  isConfirmSection: boolean = false;
  isSummarySection: boolean = false;
  transferData: any;

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
        this.transferAmountNotDefinedError = false;
        this.notEnoughBalanceError = false;
        this.invalidTransferAmountError = false;
        if (!value) {
          this.transferAmountNotDefinedError = true;
        }
        else {
          const amount = Number(value);
          if (amount > this.balance) {
            this.notEnoughBalanceError = true;
          }
          if (amount <= 0) {
            this.invalidTransferAmountError = true;
          }
        }
      });
    } catch(error) {
      console.log(error);
      this.errorMessage = 'Algo salió mal.';
    }
  }

  onContinueClick() {
    this.isConfirmSection = true;
  }

  onCancelClick() {
    this.isConfirmSection = false;
    this.errorMessage = '';
  }
  
  async onConfirmClick() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const transferData = await this.transactionService.transferMoney(
        Number(this.transferAmount.value),
        this.selectedUser);
      this.isConfirmSection = false;
      this.isSummarySection = true;
      this.setTransferData(transferData);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        this.errorMessage = error.message;
      }
    }
    this.isLoading = false;
  }

  setTransferData(transferData: any) {
    // Amount
    const strAmount = String(transferData.amount);
    const formattedAmount = strAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Date
    const serverTimestamp: Timestamp = transferData.date;
    const serverDate = serverTimestamp.toDate();
    const serverDateJS = dayjs(serverDate);
    const formattedDate = serverDateJS.format('DD/MM/YYYY - HH:mm:ss');

    this.transferData = {
      amount: formattedAmount,
      date: formattedDate,
      sender: transferData.sender,
      receiver: transferData.receiver,
    };
  }

  onNewTransferClick() {
    // Reset properties
    this.transferAmount.reset();
    this.balance = null;
    this.strBalance = '...';
    this.transferData = null;
    // Go back to users list
    this.selectedUser = null;
    this.isSummarySection = false;
  }

  onGoHomeClick() {
    this.router.navigate(['/home']);
  }
}
