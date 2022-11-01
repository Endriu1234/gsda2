import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import { toggleSidenav } from '../../store/navigation.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private store: Store<fromRoot.State>) { }

  onToggleSideNav() {
    this.store.dispatch(toggleSidenav());
  }


}
