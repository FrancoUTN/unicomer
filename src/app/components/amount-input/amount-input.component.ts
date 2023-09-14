import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.css']
})
export class AmountInputComponent {
  @Input() control = new FormControl('');
  @Input() balance: number|any;
  @Input() dismissBalance: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (this.dismissBalance || changes.balance.currentValue) {
      this.control.enable();
    }
    else {
      this.control.disable();
    }
  }
}
