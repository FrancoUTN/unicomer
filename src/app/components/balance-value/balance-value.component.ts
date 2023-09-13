import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance-value',
  templateUrl: './balance-value.component.html',
  styleUrls: ['./balance-value.component.css']
})
export class BalanceValueComponent {
  @Input() balance = '';
}
