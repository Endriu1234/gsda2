import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    initRedmineProjects, initRedmineTrackers, initRedmineUsers, loadRedmineProjects,
    loadRedmineTrackers, loadRedmineUsers
} from './items.actions';
import { from, map, switchMap } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { RedmineTracker } from './models/redmine-tracker.model';
import { environment } from 'src/environments/environment';
import { RedmineUser } from './models/redmine-user.model';
import * as fromItemsState from './items.state';
import * as fromSharedState from '../../shared/store/shared.state';

import { Store } from '@ngrx/store';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';

@Injectable()
export class ItemsGeneralEffects {

    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient) { }

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

}