import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroupState } from 'ngrx-forms';
import { State } from '../store/auth.state';
import { Store } from '@ngrx/store';
import { getLoggingFormData } from '../store/auth.selectors';
import { startLogin } from '../store/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  formState$: Observable<FormGroupState<any>>;

  constructor(private store: Store<State>) {
    this.formState$ = this.store.select(getLoggingFormData);
  }


  login() {
    this.store.dispatch(startLogin());
  }

}
