import { Component } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent {
	userBalance: number | any

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.getCurrentUserBalance().then(
      currentUserBalance => this.userBalance = currentUserBalance
    )
  }
}
