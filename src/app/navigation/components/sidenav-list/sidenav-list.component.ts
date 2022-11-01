import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app.reducer';
import { toggleMenuItem, toggleSidenav } from '../../store/navigation.actions';
import * as fromNavigation from '../../store/navigation.reducer';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {
  menuItems$: Observable<fromNavigation.MenuItem[]>;

  constructor(private store: Store<fromRoot.State>) {
    this.menuItems$ = this.store.select(fromNavigation.getMenuItems);
  }

  onToggleSideNav() {
    this.store.dispatch(toggleSidenav());
  }

  onToggleMenuItem(index: number) {
    this.store.dispatch(toggleMenuItem({ index }));
  }
}
