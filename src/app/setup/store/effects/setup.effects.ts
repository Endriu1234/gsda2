import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as fromSharedState from '../../../shared/store/shared.state';
import * as setupState from '../state/setup.state'
import { mergeMap, of, switchMap } from "rxjs";
import { endRefreshCache, noopAction, refreshCache } from "../actions/setup.actions";
import { environment } from "src/environments/environment";
import { RefreshCacheHttpResponse } from "../models/refreshCache-response.model";
import { addSnackbarNotification } from "src/app/shared/store/shared.actions";

@Injectable()
export class SetupEffects {
    constructor(private actions$: Actions,
        private store: Store<setupState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient) { }

    refreshCache$ = createEffect(() => this.actions$.pipe(
        ofType(refreshCache),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-cache').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Cache refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshCache());
            }))
        })
    ));

}