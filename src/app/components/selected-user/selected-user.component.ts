import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-selected-user',
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.css']
})
export class SelectedUserComponent {
  @Input() selectedUser: any;
}
