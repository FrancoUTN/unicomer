import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  // Transaction
  @Input() transferAmount = new FormControl(
    { value: '', disabled: true });
  @Input() amountErrors: any = {
    required: false,
    invalid: false,
    tooLow: false,
    notEnoughBalance: false,
  };
  @Input() transferData: any;
  // Balance
	@Input() balance: number|any;
	@Input() strBalance: string = '...';
  // Flow control
  @Input() isConfirmSection: boolean = false;
  @Input() isSummarySection: boolean = false;
  // Other user(s)
  @Input() otherUsers: Array<any> = [];
  @Input() selectedUser: any;
  // Output
  @Output() selectUser = new EventEmitter();
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

  onUserClick(user: any) {
    this.selectUser.emit(user);
  }
}
