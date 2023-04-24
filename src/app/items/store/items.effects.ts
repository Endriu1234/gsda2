import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    initRedmineProjects, initRedmineTrackers, initRedmineUsers, loadRedmineProjects,
    loadRedmineTrackers, loadRedmineUsers, noopAction, setRedmineProjectsFilter, setRedmineUsersByLetterFilter,
    findItemById
} from './items.actions';
import { catchError, from, map, mergeMap, of, startWith, switchMap } from "rxjs";
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { RedmineTracker } from './models/redmine-tracker.model';
import { environment } from 'src/environments/environment';
import { RedmineUser } from './models/redmine-user.model';
import { RedmineProject } from './models/redmine-project.model';
import { SetValueAction } from 'ngrx-forms';
import { ITEM_CREATION_FORMID } from './items.state';
import * as fromItemsState from './items.state';
import * as fromSharedState from '../../shared/store/shared.state';

import { Store } from '@ngrx/store';
import { validateProject, validateUser, validateCR, validateIssue, validateTms, validateFromId } from './items.validation';
import { Item } from './models/item.model';
import { addSnackbarNotification } from '../../shared/store/shared.actions';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';

const BACKEND_URL = environment.apiUrl + "/redmine/items/get-redmine-trackers";

export const validateUserError = "validateUserError";
export const validateCRError = "validateCRError";
export const validateIssueError = "validateIssueError";
export const validateTmsError = "validateTmsError";
export const validateFromIdError = "validateFromIdError";
export const validateProjectError = "validateProjectError";

@Injectable()
export class ItemsEffects {

    constructor(private actions$: Actions, private store: Store<fromItemsState.State>, private sharedStore: Store<fromSharedState.State>, private http: HttpClient) { }

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
                return from(validateProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilter())));

            if (action.controlId === ITEM_CREATION_FORMID + '.user')
                return from(validateUser(this.store, validateUserError, action.controlId, action.value).pipe(startWith(setRedmineUsersByLetterFilter())));

            if (action.controlId === ITEM_CREATION_FORMID + '.cr')
                return from(validateCR(this.store, this.http, validateCRError, action.controlId, action.value));

            if (action.controlId === ITEM_CREATION_FORMID + '.issue')
                return from(validateIssue(this.store, this.http, validateIssueError, action.controlId, action.value));

            if (action.controlId === ITEM_CREATION_FORMID + '.tms')
                return from(validateTms(this.store, this.http, validateTmsError, action.controlId, action.value));

            if (action.controlId === ITEM_CREATION_DIALOG + '.fromId')
                return from(validateFromId(this.store, this.http, validateFromIdError, action.controlId, action.value));

            return of(noopAction());
        })
    ));


            return of(noopAction());
        })
    ));
}