import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-forms',
  templateUrl: './auth-forms.component.html',
  styleUrls: ['./auth-forms.component.css']
})
export class AuthFormsComponent implements OnInit {
  currentUrl: string = "";
  routeSubscription?: Subscription;
  // virtualKeyboardEnabled: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe(() => {
      if (this.currentUrl !== this.router.url) {
        this.currentUrl = this.router.url;
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
