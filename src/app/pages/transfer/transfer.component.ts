import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl } from '@angular/forms';

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

  constructor(
    private transactionService: TransactionService,
    private userService: UserService) { }

  async ngOnInit() {
    this.otherUsers = await this.userService.getEveryOtherUser();
    const balance = await this.transactionService.getCurrentUserBalance();
    this.setBalanceProperties(balance);
    // Validation
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
  }

  setBalanceProperties(balance: number) {
    this.balance = balance;
    const strBalance = balance.toString();
    this.strBalance = strBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  onUserClick(user: any) {
    this.selectedUser = user;
  }

  onContinueClick() {
    this.isConfirmSection = true;
  }

  onCancelClick() {
    this.isConfirmSection = false;
  }

  async onConfirmClick() {
    this.isLoading = true;
    this.errorMessage = '';
    let transferData;
    try {
      transferData = await this.transactionService.transferMoney(
        Number(this.transferAmount.value),
        this.selectedUser);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        this.errorMessage = error.message;
      }
    }
    this.isLoading = false;
    console.log(transferData);
  }
}
