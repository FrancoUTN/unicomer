import { Component } from '@angular/core';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  otherUsers: Array<any> = [];

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.otherUsers = await this.userService.getEveryOtherUser();
  }
}
