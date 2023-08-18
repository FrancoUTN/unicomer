import { Component } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  transactions: Array<any> = [];

  ngOnInit() {
    this.transactions = [
      {
        a: 1
      },
      {
        a: 2
      },3,4
    ];
  }
}
