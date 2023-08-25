import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';

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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
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
      },
      {
        id: 'logout',
        iconName: 'logout',
        description: 'Cerrar sesión',
      },
    ];
  }

  async onMenuOptionClick(menuOptionID: string) {
    console.log(menuOptionID);
    switch (menuOptionID) {
      case 'logout':
        await this.authService.signOut();
        this.router.navigate(['/auth']);
        break;
    }
  }
}
