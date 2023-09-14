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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.balance.currentValue) {
      this.control.enable();
    } else {
      this.control.disable();
    }
  }
}
