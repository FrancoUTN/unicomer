import { Component } from '@angular/core';

import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  transactions: Array<any> = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.loadCurrentUserTransactionsArray(this.transactions);
  }
}
