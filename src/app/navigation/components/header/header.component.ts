import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app.reducer';
import * as fromAuthState from '../../../auth/store/auth.state'
import * as fromAuthSelectors from '../../../auth/store/auth.selectors'

import { toggleSidenav } from '../../store/navigation.actions';
import { AutoAuthService } from 'src/app/auth/auto-auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isUserLogged$: Observable<boolean> | null = null;

  constructor(private store: Store<fromRoot.State>, private authStore: Store<fromAuthState.State>, private autoAuthService: AutoAuthService) { }

  ngOnInit(): void {
    this.authStore.select(fromAuthSelectors.getIsUserLogged).subscribe(e => {
      console.log(`isLogged value: ${e}`);
    });
    this.isUserLogged$ = this.authStore.select(fromAuthSelectors.getIsUserLogged);
  }

  onToggleSideNav() {
    this.store.dispatch(toggleSidenav());
  }

  onLogout() {
    this.autoAuthService.logout();
  }


}
