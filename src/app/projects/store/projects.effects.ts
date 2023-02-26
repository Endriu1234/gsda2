import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initRedmineProjects, loadRedmineProjects,initSoftDevProjects, loadSoftDevProjects } from './projects.actions';
import { RedmineProject } from './models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';

const GET_SD_PROJECTS_URL = environment.apiUrl + '/softdev/projects/get-softdev-projects';
const GET_REDMINE_PROJECTS_URL = environment.apiUrl + '/redmine/items/get-redmine-projects';

@Injectable()
export class ProjectsEffects {

    constructor(private actions$: Actions, private http: HttpClient) { }

    initRedmineProjects$ = createEffect(() => this.actions$.pipe(ofType(initRedmineProjects),
        switchMap(() => {
            return this.http.get<RedmineProject[]>(GET_REDMINE_PROJECTS_URL);
        }), map(redmineProjects => loadRedmineProjects({ redmineProjects }))
    ));

    initSoftDevProjects$ = createEffect(() => this.actions$.pipe(ofType(initSoftDevProjects),
        switchMap(() => {
            return this.http.get<SoftDevProject[]>(GET_SD_PROJECTS_URL);
        }), map(softdevProjects => loadSoftDevProjects({ softdevProjects }))
    ));

}