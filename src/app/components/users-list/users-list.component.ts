import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  @Input() selectedUser: any;
  @Input() users: Array<any> = [];
  @Output() onUserClick = new EventEmitter();
  imageLoaded: boolean = false;

  onUserClickHandler(user: any) {
    this.onUserClick.emit(user);
  }

  onImageLoaded() {
    this.imageLoaded = true;
  }
}
