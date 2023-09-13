import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-binary-question',
  templateUrl: './binary-question.component.html',
  styleUrls: ['./binary-question.component.css']
})
export class BinaryQuestionComponent {
  @Input() questionText: string = '';
  @Input() cancelText: string = '';
  @Input() proceedText: string = '';
  @Input() cancelMatColor: string = '';
  @Input() proceedMatColor: string = '';
  @Output() cancel = new EventEmitter();
  @Output() proceed = new EventEmitter();
  
  onCancelClick() {
    this.cancel.emit();
  }
  
  onProceedClick() {
    this.proceed.emit();
  }
}
