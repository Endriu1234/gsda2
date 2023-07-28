import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { clearRedirectURLForLogin, loginFaliure, loginSuccess, logout, startLogin } from './auth.actions';
import { catchError, from, map, mergeMap, of, tap, startWith, switchMap, take } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromSharedState from '../../shared/store/shared.state'
import * as fromAuthState from './auth.state';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { AuthDataHttpResponse } from './models/auth-data-http-response'
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { getLoggingFormData, getRedirectURL } from './auth.selectors';
import { AutoAuthService } from '../auto-auth.service';
import { ResetAction, SetValueAction } from 'ngrx-forms';
import { Router } from '@angular/router';


@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private store: Store<fromAuthState.State>,
        private sharedStore: Store<fromSharedState.State>, private http: HttpClient,
        private authAuthService: AutoAuthService, private router: Router) {

    }

    loginStarted$ = createEffect(() => this.actions$.pipe(
        ofType(startLogin), switchMap(() => {

            return this.store.select(getLoggingFormData).pipe(take(1), switchMap(formData => {

                let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                return this.http.post<AuthDataHttpResponse>(environment.apiUrl + '/auth/login',
                    formData.value, { context }).pipe(switchMap(response => {

                        if (response.success) {

                            let expirationDate = null;

                            if (response.expiresIn) {
                                const expiresInHours = parseInt(response.expiresIn.replace('h', ''));
                                const expiresInMiliseconds = expiresInHours * 60 * 60 * 1000;
                                expirationDate = new Date((new Date().getTime() + expiresInMiliseconds));

                                this.authAuthService.startSessionTimmer(expiresInMiliseconds);
                                this.authAuthService.storeSession(response.user!, response.token!, expirationDate);
                            }

                            return [loginSuccess({ user: response.user!, token: response.token!, expirationDate })]
                        }

                        return [loginFaliure()]
                    }));
            }))




        }
        )));

    loginFaliure$ = createEffect(() => this.actions$.pipe(
        ofType(loginFaliure), tap(() => {

            this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Loggin failed', icon: fromSharedState.SnackBarIcon.Error }));
        })), { dispatch: false });


    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout), map(e => {
            this.router.navigateByUrl('/');
            return clearRedirectURLForLogin();
        })));

    loginSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess), switchMap(e => {
            return this.store.select(getRedirectURL).pipe(take(1), switchMap(url => {
                const actions: any[] = [
                    clearRedirectURLForLogin(),
                    new ResetAction(fromAuthState.LOGGING_FORMID),
                    new SetValueAction(fromAuthState.LOGGING_FORMID + '.user', ''),
                    new SetValueAction(fromAuthState.LOGGING_FORMID + '.password', '')
                ];

                if (!url)
                    url = '/';

                this.router.navigateByUrl(url);

                return actions;
            }))

        })));






}