import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './store/auth.state';
import { loginSuccess, logout } from './store/auth.actions';
import { AuthDataHttpResponse } from './store/models/auth-data-http-response';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AutoAuthService {
  private tokenTimer!: NodeJS.Timer;

  constructor(private authStore: Store<State>) { }

  GSDA_AUTH_USER = "gsda_auth_user";
  GSDA_AUTH_TOKEN = "gsda_auth_token";
  GSDA_AUTH_EXPIRATION_DATE = "gsda_auth_expiration_date";


  startSessionTimmer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      logout();
    }, duration);
  }

  tryAutoLogin() {
    const user = localStorage.getItem(this.GSDA_AUTH_USER);
    const token = localStorage.getItem(this.GSDA_AUTH_TOKEN);
    const expiration = localStorage.getItem(this.GSDA_AUTH_EXPIRATION_DATE);

    if (user && token && expiration) {
      const expirationDate = new Date(expiration);

      const now = new Date();
      const expiresIn = expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {

        this.authStore.dispatch(loginSuccess({ user, token, expirationDate }));
        this.startSessionTimmer(expiresIn);
      }
      else
        this.clearSession();
    }
    else
      this.tryLoginFakeUser();
  }

  tryLoginFakeUser() {

    if (environment.fakeUser) {
      let expirationDate = new Date();
      expirationDate = new Date(expirationDate.getTime() + 1000 * 60 * 60 * 24);
      this.authStore.dispatch(loginSuccess({ user: environment.fakeUser, token: 'FakeToken', expirationDate }));
    }

  }

  logout() {
    this.authStore.dispatch(logout());
    this.clearSession();

    if (this.tokenTimer)
      clearTimeout(this.tokenTimer);
  }

  storeSession(user: string, token: string, expirationDate: Date) {
    localStorage.setItem(this.GSDA_AUTH_USER, user);
    localStorage.setItem(this.GSDA_AUTH_TOKEN, token);
    localStorage.setItem(this.GSDA_AUTH_EXPIRATION_DATE, expirationDate.toISOString());
  }

  private clearSession() {
    localStorage.removeItem(this.GSDA_AUTH_USER);
    localStorage.removeItem(this.GSDA_AUTH_TOKEN);
    localStorage.removeItem(this.GSDA_AUTH_EXPIRATION_DATE);
  }
}
