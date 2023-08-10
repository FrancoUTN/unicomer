import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-forms',
  templateUrl: './auth-forms.component.html',
  styleUrls: ['./auth-forms.component.css']
})
export class AuthFormsComponent implements OnInit {
  currentUrl: string = "";
  virtualKeyboardEnabled: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      this.currentUrl = this.router.url;
    })
  }
}
