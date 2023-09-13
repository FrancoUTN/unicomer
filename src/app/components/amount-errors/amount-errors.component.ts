import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount-errors',
  templateUrl: './amount-errors.component.html',
  styleUrls: ['./amount-errors.component.css']
})
export class AmountErrorsComponent {
  @Input() errors: any;
  @Input() touched: boolean = false;
}
