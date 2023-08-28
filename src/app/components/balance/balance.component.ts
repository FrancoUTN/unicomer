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
	isLoading: boolean = true;
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100000,
      },
    },
    plugins: {
      // title: {
      //   text: 'Balance',
      //   display: true,
      //   align: 'start',
      //   font: {
      //     size: 16
      //   },
      //   fullSize: false,
      //   padding: 0,
      // },
      legend: {
        align: 'end',
        reverse: true,
        labels: {
          boxWidth: 16,
          boxHeight: 16,
        },
      }
    }
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
      {
        data: [],
        label: 'Semana pasada',
        backgroundColor: 'rgb(93, 149, 190)',
        borderColor: 'rgb(93, 149, 190)',
        borderRadius: 20,
      },
      {
        data: [],
        label: 'Esta semana',
        backgroundColor: 'rgb(39, 47, 101)',
        borderColor: 'rgb(39, 47, 101)',
        borderRadius: 20,
      },
    ],
  };

  private updateChart(){
    this.chart?.ngOnChanges({});
   }

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    await this.setChartData();

    this.updateChart();
    this.isLoading = false;
  }

  async setChartData() {
    let days = await this.transactionService.getCurrentUserBalanceHistory();
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

    const thisWeekDays = filledDays.slice(-7);
    const lastWeek = filledDays.slice(-14, -7);
    this.barChartData.datasets[0].data = lastWeek;
    this.barChartData.datasets[1].data = thisWeekDays;

    if (this.barChartOptions) {
      if (this.barChartOptions.scales) {
        this.barChartOptions.scales.y = {
          // Perfectable
          suggestedMax: Math.max(...thisWeekDays) + 10000,
        };
      } else {
        console.log('No scales.');
      }
    } else {
      console.log('No options.');
    }

    return;
  }
}
