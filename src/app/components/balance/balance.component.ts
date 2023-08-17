import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as dayjs from 'dayjs';

import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [
      dayjs().subtract(6, 'day').format('ddd'),
      dayjs().subtract(5, 'day').format('ddd'),
      dayjs().subtract(4, 'day').format('ddd'),
      dayjs().subtract(3, 'day').format('ddd'),
      dayjs().subtract(2, 'day').format('ddd'),
      dayjs().subtract(1, 'day').format('ddd'),
      dayjs().format('ddd'),
    ],
    datasets: [
      { data: [], label: 'Esta semana' },
      { data: [], label: 'Semana pasada' },
    ],
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.getCurrentUserBalanceHistory().then(
      days => {
        days = days.slice(-14);
        const filledDays = [];
        const emptyDays = 14 - days.length;
        for(let i = 0, j = 0; i < 14; i++) {
          if (i < emptyDays) {
            filledDays[i] = 0;
          }
          else {
            filledDays[i] = days[j];
            j++;
          }
        }
        const thisWeek = filledDays.slice(-7);
        const lastWeek = filledDays.slice(-14, -7);
        this.barChartData.datasets[0].data = thisWeek;
        this.barChartData.datasets[1].data = lastWeek;

        this.chart?.update();
      }
    )
  }
}
