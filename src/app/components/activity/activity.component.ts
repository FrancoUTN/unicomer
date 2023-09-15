import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  allTransactions: Array<any> = [];
  pages: Array<Array<any>> = [];
  currentPageIndex: number = 0;
  showingItems: string = '';
  totalItems: string = '';
  isMobile: boolean = false;
  currentUrl: string = '';
	isLoading: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router) {}

  ngOnInit() {    
    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth <= 900;
    
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
      if (this.currentUrl === '/transactions') {
        this.loadAllTransactions();
      } else {
        this.loadTransactionPages();
      }
    });
  }

  async loadAllTransactions() {
    this.isLoading = true;
    try {
      await this.transactionService.loadCurrentUserTransactionsArray(this.allTransactions);
    }
    catch (e) {
      console.log(e);
    }
    this.isLoading = false;
  }

  async loadTransactionPages() {
    this.isLoading = true;
    const transactions: Array<any> = [];
    try {
      await this.transactionService.loadCurrentUserTransactionsArray(transactions);
      this.totalItems = transactions.length.toString();
      for (let i = 0, k = 0; k < transactions.length; i++) {
        this.pages[i] = [];
        for (let j = 0; j < 5; j++, k++) {
          if (!transactions[k]) {
            break;
          }
          this.pages[i][j] = transactions[k];
        }
      }
      this.setShowing();
    }
    catch (e) {
      console.log(e);
    }
    this.isLoading = false;
  }
  
  onPreviousPageClick() {
    if (this.currentPageIndex > 0) {
     this.currentPageIndex--;
    }
    this.setShowing();
  }

  onForwardPageClick() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
    }
    this.setShowing();
  }

  setShowing() {
    const from = (this.currentPageIndex * 5) + 1;
    const to = from + this.pages[this.currentPageIndex].length - 1;
    this.showingItems = `${from}-${to}`;
  }
}
