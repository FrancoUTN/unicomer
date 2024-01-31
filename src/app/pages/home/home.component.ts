import { Component } from '@angular/core';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';

import { TransactionService } from 'src/app/services/transaction.service';

type Dayjs = dayjs.Dayjs;
interface Day {
  date: Dayjs,
  dayIncome: number,
  dayOutcome: number
}
type Month = Array<Day>;
interface Months {
  thisMonthDays: Month,
  lastMonthDays: Month
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLoading: boolean = true;
  private dataChangeSubject = new Subject<Months>();
  dataChange = this.dataChangeSubject.asObservable();

  constructor(private transactionService: TransactionService) { }

  async ngOnInit() {
    try {
      const months = await this.transactionService.getCurrentUserIncomeAndOutcome() as Months;
      this.dataChangeSubject.next(months);
    }
    catch (e) {
      console.log(e);
    }
    this.isLoading = false;
  }
}
