import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  @Input() amount: any;
  @Input() date: any;
  @Input() receiver: any;
  @Input() sender: any;
  @Input() type: any;
}
