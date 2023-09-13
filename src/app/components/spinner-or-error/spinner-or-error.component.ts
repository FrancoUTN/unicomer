import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-or-error',
  templateUrl: './spinner-or-error.component.html',
  styleUrls: ['./spinner-or-error.component.css']
})
export class SpinnerOrErrorComponent {
	@Input() isLoading: boolean = false;
  @Input() errorMessage: string = '';
}
