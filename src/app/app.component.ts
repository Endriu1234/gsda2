import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from './app.reducer';
import * as fromNavigation from './navigation/store/navigation.reducer';
import { changeSidenavOpened } from './navigation/store/navigation.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidenavOpened$: Observable<boolean>;

  title = 'GSDA';

  constructor(private store: Store<fromRoot.State>) {
    this.isSidenavOpened$ = this.store.select(fromNavigation.getSidenavOpened);
  }

  sidenavOpenedChange(opened: boolean) {
    this.store.dispatch(changeSidenavOpened({ opened }));
  }


}
