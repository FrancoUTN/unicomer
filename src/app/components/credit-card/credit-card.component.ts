import { Component } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent {
	balance: string = '...';
	firstName: string | any;
	lastName: string | any;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService) {}

  ngOnInit() {
    this.transactionService.getCurrentUserBalance()
    .then(currentUserBalance => {
      const strBalance = currentUserBalance.toString();
      this.balance = strBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    })
    this.userService.getCurrentUserData().then(userData => {
      if (!userData) {
        throw new Error('No data to display');
      }
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
    })
  }
}
