import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { initRedmineTrackers, loadRedmineTrackers } from './items.actions';
import { map, switchMap } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { RedmineTracker } from './models/redmine-tracker.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/redmine/items/get-redmine-trackers";

@Injectable()
export class ItemsEffects {

    constructor(private actions$: Actions, private http: HttpClient) { }

    initRedmineTrackers$ = createEffect(() => this.actions$.pipe(ofType(initRedmineTrackers),
        switchMap(() => {
            return this.http.get<RedmineTracker[]>(environment.apiUrl + '/redmine/items/get-redmine-trackers');
        }), map(redmineTrackers => loadRedmineTrackers({ redmineTrackers }))
    ));

}