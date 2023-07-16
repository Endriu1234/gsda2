import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginFaliure, loginSuccess, startLogin } from './auth.actions';
import { catchError, from, map, mergeMap, of, tap, startWith, switchMap, take } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromSharedState from '../../shared/store/shared.state'
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';



@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private sharedStore: Store<fromSharedState.State>) {

    }

    loginStarted$ = createEffect(() => this.actions$.pipe(
        ofType(startLogin), switchMap(() => {


            //  return [loginFaliure()]
            return [loginSuccess()]
        })));

    loginFaliure$ = createEffect(() => this.actions$.pipe(
        ofType(loginFaliure), tap(() => {

            this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Loggin failed', icon: fromSharedState.SnackBarIcon.Error }));
        })), { dispatch: false });




}