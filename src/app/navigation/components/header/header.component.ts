import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app.reducer';
import * as fromAuthState from '../../../auth/store/auth.state'
import * as fromAuthSelectors from '../../../auth/store/auth.selectors'

import { toggleSidenav } from '../../store/navigation.actions';
import { AutoAuthService } from 'src/app/auth/auto-auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  getUserLogin$: Observable<string | null> | null = null;

  constructor(private router: Router, private store: Store<fromRoot.State>, private authStore: Store<fromAuthState.State>, private autoAuthService: AutoAuthService) { }

  ngOnInit(): void {
    this.getUserLogin$ = this.authStore.select(fromAuthSelectors.getUserLogin);
  }

  onToggleSideNav() {
    this.store.dispatch(toggleSidenav());
  }

  onLogout() {
    this.autoAuthService.logout();
  }
  onLogin() {
    this.router.navigateByUrl('/auth/login');
  }


}
