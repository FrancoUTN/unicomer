import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  transactions: Array<any> = [];
  isMobile: boolean = false;
  currentUrl: string = '';
	isLoading: boolean = true;

  constructor(
    private transactionService: TransactionService,
    private router: Router) {}

  ngOnInit() {
    this.transactionService.loadCurrentUserTransactionsArray(this.transactions)
      .then(() => this.isLoading = false);

    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth <= 900;
    
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }
}
