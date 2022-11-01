import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import { toggleSidenav } from '../../store/navigation.actions';

@Component({
  selector: 'app-menu-switch',
  templateUrl: './menu-switch.component.html',
  styleUrls: ['./menu-switch.component.scss']
})
export class MenuSwitchComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
  }

  onToggleSideNav() {
    this.store.dispatch(toggleSidenav());
  }

}
