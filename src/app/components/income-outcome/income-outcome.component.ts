import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import * as dayjs from 'dayjs';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';

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
type DifferenceWithLastMonth = 'positive' | 'negative' | 'neutral';

@Component({
  selector: 'app-income-outcome',
  templateUrl: './income-outcome.component.html',
  styleUrls: ['./income-outcome.component.css']
})
export class IncomeOutcomeComponent {
  @Input() isIncome: boolean = false;
  @Input() isLoading: boolean = true;
  @Input() dataChange?: Observable<Months>;
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
        pointBackgroundColor: 'white',
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
        hitRadius: 10,
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
      colors: {
        forceOverride: true
      },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit() {
    this.dataChange?.subscribe(months => {
      this.months = months;

      this.lineChartData.datasets[0].label = this.isIncome ? 'Ingresos' : 'Egresos';
      const chartColorRGB = this.isIncome ? '39, 47, 101' : '93, 149, 190';
      this.lineChartData.datasets[0].backgroundColor = `rgba(${chartColorRGB},0.2)`;
      this.lineChartData.datasets[0].borderColor = `rgba(${chartColorRGB},1)`;

      this.updateChart();
      this.setThisMonthTotal();
      this.calculateMonthsDifference();
    });
  }

  updateChart() {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }
    this.months.thisMonthDays.forEach(day => {
      if (this.isIncome) {
        this.lineChartData.datasets[0].data.push(day.dayIncome);
      } else {
        this.lineChartData.datasets[0].data.push(day.dayOutcome);
      }
      this.lineChartData?.labels?.push(day.date.format('DD/MM'));
    });
    this.chart?.update();
  }

  calculateTotal(theMonth: Month) {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }

    function accumulate(this: IncomeOutcomeComponent, day: Day) {
      if (this.isIncome) {
        accuTotal += day.dayIncome;
      } else {
        accuTotal += day.dayOutcome;
      }
    }

    let accuTotal = 0;
    theMonth.forEach(accumulate, this);
    return accuTotal;
  }

  setThisMonthTotal() {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }
    this.thisMonthTotal = this.calculateTotal(this.months.thisMonthDays);
    const strTotal = this.thisMonthTotal.toString();
    this.strThisMonthTotal = strTotal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  calculateMonthsDifference() {
    if (!this.months) {
      throw new Error('Months array hasn\'t been initialized');
    }
    const lastMonthTotal = this.calculateTotal(this.months?.lastMonthDays);
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
    let relativeDifference = absoluteDifference * 100 / lastMonthTotal;
    relativeDifference = Math.floor(relativeDifference);

    this.monthsDifference = relativeDifference;
    const strDifference = this.monthsDifference.toString();
    this.strMonthsDifference = strDifference.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
