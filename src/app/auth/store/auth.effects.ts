import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginFaliure, loginSuccess, startLogin } from './auth.actions';
import { catchError, from, map, mergeMap, of, tap, startWith, switchMap, take } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromSharedState from '../../shared/store/shared.state'
import * as fromAuthState from './auth.state';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { AuthDataHttpResponse } from './models/auth-data-http-response'
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { getLoggingFormData } from './auth.selectors';



@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private store: Store<fromAuthState.State>,
        private sharedStore: Store<fromSharedState.State>, private http: HttpClient) {

    }

    loginStarted$ = createEffect(() => this.actions$.pipe(
        ofType(startLogin), switchMap(() => {

            return this.store.select(getLoggingFormData).pipe(take(1), switchMap(formData => {

                let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                return this.http.post<AuthDataHttpResponse>(environment.apiUrl + '/auth/login',
                    formData.value, { context }).pipe(switchMap(response => {

                        if (response.success)
                            return [loginSuccess({ authData: response })]

                        return [loginFaliure()]
                    }));
            }))




        }
        )));

    loginFaliure$ = createEffect(() => this.actions$.pipe(
        ofType(loginFaliure), tap(() => {

            this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Loggin failed', icon: fromSharedState.SnackBarIcon.Error }));
        })), { dispatch: false });




}