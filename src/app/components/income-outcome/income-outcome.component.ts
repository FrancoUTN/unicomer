import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as dayjs from 'dayjs';

import { TransactionService } from 'src/app/services/transaction.service';

type Dayjs = dayjs.Dayjs;
interface Day {
  date: Dayjs,
  dayIncome: number,
  dayOutcome: number
}
interface Months {
  thisMonthDays: Array<Day>,
  lastMonthDays: Array<Day>
}
type DifferenceWithLastMonth = 'positive' | 'negative' | 'neutral';

@Component({
  selector: 'app-income-outcome',
  templateUrl: './income-outcome.component.html',
  styleUrls: ['./income-outcome.component.css']
})
export class IncomeOutcomeComponent {
  months?: Months;
  thisMonthTotal: number = 0;
  strThisMonthTotal: string = '...';
  monthsDifference: number = 0;
  strMonthsDifference: string = '...';
  differenceWithLastMonth: DifferenceWithLastMonth = 'neutral';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        fill: 'origin',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
      point: {
        pointStyle: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    this.months = await this.transactionService.getCurrentUserIncomeAndOutcome();

    this.updateChart();
    this.calculateThisMonthTotal();
    this.calculateMonthsDifference();
  }

  updateChart() {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }
    this.months.thisMonthDays.forEach(day => {
      this.lineChartData.datasets[0].data.push(day.dayIncome);
      this.lineChartData?.labels?.push(day.date.format('DD/MM'));
    });
    this.chart?.update();
  }

  calculateThisMonthTotal() {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }
    let accuTotal = 0;
    this.months.thisMonthDays.forEach(day => {
      accuTotal += day.dayIncome;
    });
    this.thisMonthTotal = accuTotal;
    const strTotal = accuTotal.toString();
    this.strThisMonthTotal = strTotal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  calculateLastMonthTotal() {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }
    let accuTotal = 0;
    this.months.lastMonthDays.forEach(day => {
      accuTotal += day.dayIncome;
    });
    return accuTotal;
  }

  calculateMonthsDifference() {
    const lastMonthTotal = this.calculateLastMonthTotal();
    if (lastMonthTotal === 0) {
      this.differenceWithLastMonth = 'neutral';
      this.strMonthsDifference = 'N/A';
      return;
    }

    let absoluteDifference = lastMonthTotal - this.thisMonthTotal;

    if (absoluteDifference <= 0) {
      this.differenceWithLastMonth = 'positive';
    }
    else if (absoluteDifference >= 0) {
      this.differenceWithLastMonth = 'negative';
    }    
    else {
      this.differenceWithLastMonth = 'neutral';
    }

    absoluteDifference = Math.abs(absoluteDifference);
    const relativeDifference = absoluteDifference * 100 / lastMonthTotal;

    this.monthsDifference = relativeDifference;
    const strDifference = this.monthsDifference.toString();
    this.strMonthsDifference = strDifference.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
