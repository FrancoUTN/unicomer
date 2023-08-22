import { Component } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-income-outcome',
  templateUrl: './income-outcome.component.html',
  styleUrls: ['./income-outcome.component.css']
})
export class IncomeOutcomeComponent {

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    const months = await this.transactionService.getCurrentUserIncomeAndOutcome();
    console.log(months);
  }
}
