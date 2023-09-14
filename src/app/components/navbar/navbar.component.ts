import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

interface MenuOption {
  id: string,
  iconName: string,
  description: string,
  route?: string,
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  menuOptions: Array<MenuOption> = [];
  currentUrl: string = '';
	firstName: string | any;
	lastName: string | any;
	profilePictureURL: string | any;
	isLoading: boolean = true;
  @ViewChild("searchBarTooltip") searchBar?: MatTooltip;
  @ViewChild("settingsTooltip") settingsTooltip?: MatTooltip;
  @ViewChild("notificationsTooltip") notificationsTooltip?: MatTooltip;
  @ViewChild("profilePictureTooltip") profilePictureTooltip?: MatTooltip;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
    
    this.userService.getCurrentUserData().then(userData => {
      if (!userData) {
        throw new Error('No data to display');
      }
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
      this.profilePictureURL = userData.profilePictureURL;
      this.isLoading = false;
    });

    this.menuOptions = [
      {
        id: 'home',
        iconName: 'home',
        description: 'Inicio',
        route: '/home',
      },
      {
        id: 'cards',
        iconName: 'account_balance_wallet',
        description: 'Tarjetas',
        route: '/cards',
      },
      {
        id: 'transactions',
        iconName: 'sync_alt',
        description: 'Operaciones',
        route: '/transactions',
      },
      {
        id: 'transfer',
        iconName: 'people_alt',
        description: 'Transferir',
        route: '/transfer',
      },
      {
        id: 'withdrawal',
        iconName: 'arrow_downward',
        description: 'Extraer',
        route: '/withdrawal',
      },
      {
        id: 'deposit',
        iconName: 'arrow_upward',
        description: 'Depositar',
        route: '/deposit',
      },
      {
        id: 'logout',
        iconName: 'logout',
        description: 'Cerrar sesión',
      },
    ];
  }

  async onMenuOptionClick(menuOptionID: string) {
    switch (menuOptionID) {
      case 'logout':
        await this.authService.signOut();
        this.router.navigate(['/auth']);
        break;
    }
  }

  displaySearchBarTooltip(){
    if (this.searchBar) {
      this.searchBar.disabled = false;
      this.searchBar.show();
      setTimeout(() => {
        if (this.searchBar) {
          this.searchBar.disabled = true;
        }
      }, 1000);
    }
  }

  displaySettingsTooltip(){
    if (this.settingsTooltip) {
      this.settingsTooltip.disabled = false;
      this.settingsTooltip.show();
      setTimeout(() => {
        if (this.settingsTooltip) {
          this.settingsTooltip.disabled = true;
        }
      }, 1000);
    }
  }

  displayNotificationsTooltip(){
    if (this.notificationsTooltip) {
      this.notificationsTooltip.disabled = false;
      this.notificationsTooltip.show();
      setTimeout(() => {
        if (this.notificationsTooltip) {
          this.notificationsTooltip.disabled = true;
        }
      }, 1000);
    }
  }
  
  displayProfilePictureTooltip(){
    if (this.profilePictureTooltip) {
      this.profilePictureTooltip.disabled = false;
      this.profilePictureTooltip.show();
      setTimeout(() => {
        if (this.profilePictureTooltip) {
          this.profilePictureTooltip.disabled = true;
        }
      }, 1000);
    }
  }
}
