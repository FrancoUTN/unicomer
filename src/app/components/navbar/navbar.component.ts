import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface MenuOption {
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

  ngOnInit() {
    this.menuOptions = [
      {
        iconName: 'home',
        description: 'Inicio',
      },
      {
        iconName: 'people_alt',
        description: 'Transferir',
      },
      {
        iconName: 'logout',
        description: 'Cerrar sesión',
      },
    ];
  }
}
