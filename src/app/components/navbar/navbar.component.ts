import { Component, inject } from '@angular/core';
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
  public menuOptions: Array<MenuOption> = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.menuOptions = [
      {
        id: 'home',
        iconName: 'home',
        description: 'Inicio',
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

  onMenuOptionClick(menuOptionID: string) {
    switch (menuOptionID) {
      case 'logout':
        this.authService.signOut();
        break;
    }
  }
}
