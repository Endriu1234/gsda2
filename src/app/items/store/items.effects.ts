import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    initRedmineProjects, initRedmineTrackers, initRedmineUsers, loadRedmineProjects,
    loadRedmineTrackers, loadRedmineUsers, noopAction, setRedmineProjectsFilter, setRedmineUsersFilter
} from './items.actions';
import { from, map, of, startWith, switchMap } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { RedmineTracker } from './models/redmine-tracker.model';
import { environment } from 'src/environments/environment';
import { RedmineUser } from './models/redmine-user.model';
import { RedmineProject } from './models/redmine-project.model';
import { SetValueAction } from 'ngrx-forms';
import { ITEM_CREATION_FORMID } from './items.state';
import * as fromItemsState from './items.state';

import { Store } from '@ngrx/store';
import { validateProject, validateUser, validateCR } from './items.validation';

const BACKEND_URL = environment.apiUrl + "/redmine/items/get-redmine-trackers";

@Injectable()
export class ItemsEffects {

    constructor(private actions$: Actions, private store: Store<fromItemsState.State>, private http: HttpClient) { }

    initRedmineTrackers$ = createEffect(() => this.actions$.pipe(ofType(initRedmineTrackers),
        switchMap(() => {
            return this.http.get<RedmineTracker[]>(environment.apiUrl + '/redmine/items/get-redmine-trackers');
        }), map(redmineTrackers => loadRedmineTrackers({ redmineTrackers }))
    ));

    initRedmineUsers$ = createEffect(() => this.actions$.pipe(ofType(initRedmineUsers),
        switchMap(() => {
            return this.http.get<RedmineUser[]>(environment.apiUrl + '/redmine/items/get-redmine-users');
        }), map(redmineUsers => loadRedmineUsers({ redmineUsers }))
    ));

    initRedmineProjects$ = createEffect(() => this.actions$.pipe(ofType(initRedmineProjects),
        switchMap(() => {
            return this.http.get<RedmineProject[]>(environment.apiUrl + '/redmine/items/get-redmine-projects');
        }), map(redmineProjects => loadRedmineProjects({ redmineProjects }))
    ));

    itemCreationFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === ITEM_CREATION_FORMID + '.project')
                return from(validateProject(this.store, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilter())));

            if (action.controlId === ITEM_CREATION_FORMID + '.user')
                return from(validateUser(this.store, action.controlId, action.value).pipe(startWith(setRedmineUsersFilter())));

            if (action.controlId === ITEM_CREATION_FORMID + '.cr')
                return from(validateCR(this.store, this.http, action.controlId, action.value));

            return of(noopAction());
        })
    ));


}