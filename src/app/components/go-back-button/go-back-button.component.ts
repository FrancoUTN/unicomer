import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.css']
})
export class GoBackButtonComponent {
  @Output() onClick = new EventEmitter();
}
