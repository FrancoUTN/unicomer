import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-deposit-withdrawal',
  templateUrl: './deposit-withdrawal.component.html',
  styleUrls: ['./deposit-withdrawal.component.css']
})
export class DepositWithdrawalComponent {
  // Transaction
  @Input() transactionAmount = new FormControl(
    { value: '', disabled: true });
  @Input() amountErrors: any;
  @Input() transactionData: any;
  @Input() strAmount: string = '';
  // Balance
	@Input() balance: number|any;
	@Input() strBalance: string = '...';
  // Flow control
  @Input() isConfirmSection: boolean = false;
  @Input() isSummarySection: boolean = false;
  // Type
  @Input() transactionType: string = '';
  // Output
  @Output() continue = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
  @Output() goHome = new EventEmitter();
  @Output() restart = new EventEmitter();

  onContinueClick() {
    this.continue.emit();
  }

  onCancelClick() {
    this.cancel.emit();
  }
  
  onConfirmClick() {
    this.confirm.emit();
  }

  onGoHomeClick() {
    this.goHome.emit();
  }

  onRestartClick() {
    this.restart.emit();    
  }
}
