import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-continue-button',
  templateUrl: './continue-button.component.html',
  styleUrls: ['./continue-button.component.css']
})
export class ContinueButtonComponent {
  @Input() errors: any;
  @Input() pristine: boolean = true;
  @Output() onClick = new EventEmitter();
}
