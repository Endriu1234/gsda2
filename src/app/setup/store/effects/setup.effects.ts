import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as fromSharedState from '../../../shared/store/shared.state';
import * as setupState from '../state/setup.state'
import { mergeMap, of, switchMap } from "rxjs";
import { endRefreshCache, endRefreshCustomFields, endRefreshEmailSettings, endRefreshRedmineProjects, endRefreshSDProjects, endRefreshUserPreferences, endRefreshVersions, noopAction, refreshCache, refreshCustomFields, refreshEmailSettings, refreshRedmineProjects, refreshSDProjects, refreshUserPreferences, refreshVersions } from "../actions/setup.actions";
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

    refreshVersions$ = createEffect(() => this.actions$.pipe(
        ofType(refreshVersions),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-versions').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Versions refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshVersions());
            }))
        })
    ));

    refreshSDProjects$ = createEffect(() => this.actions$.pipe(
        ofType(refreshSDProjects),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-sd-projects').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'SD Projects refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshSDProjects());
            }))
        })
    ));

    refreshRedmineProjects$ = createEffect(() => this.actions$.pipe(
        ofType(refreshRedmineProjects),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-redmine-projects').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Redmine Projects refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshRedmineProjects());
            }))
        })
    ));

    refreshCustomFields$ = createEffect(() => this.actions$.pipe(
        ofType(refreshCustomFields),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-custom-fields').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Custom Fields refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshCustomFields());
            }))
        })
    ));

    refreshEmailSettings$ = createEffect(() => this.actions$.pipe(
        ofType(refreshEmailSettings),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-email-settings').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Email Settings refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshEmailSettings());
            }))
        })
    ));

    refreshUserPreferences$ = createEffect(() => this.actions$.pipe(
        ofType(refreshUserPreferences),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-user-preferences').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'User Preferences refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(endRefreshUserPreferences());
            }))
        })
    ));

}