import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, startWith, switchMap } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initRedmineProjects, loadRedmineProjects, initSoftDevProjects, loadSoftDevProjects, findProjectById, noopAction, setRedmineProjectsFilter, setSoftDevProjectsFilter } from './projects.actions';
import { RedmineProject } from '../../shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { Store } from '@ngrx/store';
import * as fromProjectsState from './projects.state';
import * as fromSharedState from '../../shared/store/shared.state';
import { SetValueAction } from 'ngrx-forms';
import { PROJECT_CREATION_DIALOG, PROJECT_CREATION_FORMID } from './projects.state';
import { validateProject, validateSDProject } from './projects.validation';
import { getSoftDevProjects } from './projects.selector';
import { formatDate } from '@angular/common';

const GET_SD_PROJECTS_URL = environment.apiUrl + '/softdev/projects/get-softdev-projects';
const GET_REDMINE_PROJECTS_URL = environment.apiUrl + '/redmine/items/get-redmine-projects';

export const validateProjectError = "validateProjectError";
export const validateSDProjectError = "validateSDProjectError";

@Injectable()
export class ProjectsEffects {

    constructor(private actions$: Actions, private store: Store<fromProjectsState.State>, private sharedStore: Store<fromSharedState.State>, private http: HttpClient) { }

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

    projectCreationFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === PROJECT_CREATION_FORMID + '.redmineProject')
                return from(validateProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilter())));

            if (action.controlId === PROJECT_CREATION_DIALOG + '.projectId')
                return from(validateSDProject(this.store, validateSDProjectError, action.controlId, action.value).pipe(startWith(setSoftDevProjectsFilter())));

            return of(noopAction());
        })
    ));

    getProjectById$ = createEffect(() => this.actions$.pipe(
        ofType(findProjectById),
        switchMap((action: { id: string }) => {
            return this.store.select(getSoftDevProjects).pipe(mergeMap(sdProjects => {
                let sdProject = sdProjects.find(sd => sd.PRODUCT_VERSION_NAME == action.id);
                if (sdProject) {
                    return of(new SetValueAction(fromProjectsState.PROJECT_CREATION_FORMID + '.identifier', sdProject.PRODUCT_VERSION_NAME.replace(/\./g, "_").toLocaleLowerCase()),
                        new SetValueAction(fromProjectsState.PROJECT_CREATION_FORMID + '.name', sdProject.PRODUCT_VERSION_NAME),
                        new SetValueAction(fromProjectsState.PROJECT_CREATION_FORMID + '.description', this.createDescription(sdProject)),
                        new SetValueAction(fromProjectsState.PROJECT_CREATION_FORMID + '.wiki', this.createWikiInformation(sdProject)))
                }

                return of(noopAction());
            })
                , catchError(error => {
                    console.log(error);
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting" }));
                    return of(noopAction());
                }))
        })
    ));

    /*
    h1. Important info

    h2. Dates

    * *Dev Start: 03/27/2023* 
    * *Dev End: 04/03/2023*

    Test Start: 04/05/2023            
    Test End: 04/06/2023

    * Delivery Date: 04/06/2023*

    h2. Release Candidate

    * *No*

    h2. Project Name

    * GENE4.1.17.230_UMICH_HF040623

    h2. Branch

    * hotfixes/4_1_17_230_HF_UMICH
 */
    private createWikiInformation(sdProject: SoftDevProject): string {
        let sWiki: string = "";

        sWiki += `h1. Important info \n\n`;
        sWiki += `h2. Dates \n\n`;
        sWiki += `* *Dev Start: ${formatDate(sdProject.PRODUCT_DEV_START, "MM/dd/yyyy", 'en-US')}* \n`;
        sWiki += `* *Dev End: ${formatDate(sdProject.PRODUCT_DEV_END, "MM/dd/yyyy", 'en-US')}* \n\n`;
        sWiki += `Test Start: ${formatDate(sdProject.PRODUCT_TEST_START, "MM/dd/yyyy", 'en-US')} \n`;
        sWiki += `Test End: ${formatDate(sdProject.PRODUCT_TEST_END, "MM/dd/yyyy", 'en-US')} \n\n`;
        sWiki += `* Delivery Date: ${formatDate(sdProject.PRODUCT_DELIVERY_DATE, "MM/dd/yyyy", 'en-US')}* \n\n`;
        sWiki += `h2. Release Candidate \n\n`;
        sWiki += `* *${sdProject.PRODUCT_RELEASE_CANDIDATE}* \n\n`;
        sWiki += `h2. Project Name \n\n`;
        sWiki += `* ${sdProject.PROJECT_NAME} \n\n`;
        sWiki += `h2. Branch \n\n`;
        sWiki += `* ${sdProject.PRODUCT_BRANCH}`;

        return sWiki;
    }

    private createDescription(sdProject: SoftDevProject): string {
        let sDesc: string = sdProject.PROJECT_NAME;

        if (sdProject.PRODUCT_VERSION_NAME) {
            let hfPos = sdProject.PRODUCT_VERSION_NAME.indexOf("HF");
            if (hfPos >= 0) {
                let index = sdProject.PRODUCT_VERSION_NAME.indexOf("_");
                if (index > 0) {
                    sDesc = "HotFix on ";
                    sDesc += sdProject.PRODUCT_VERSION_NAME.substring(0, index);
                    sDesc += " version for ";
                    sDesc += sdProject.PRODUCT_VERSION_NAME.substring(index + 1, sdProject.PRODUCT_VERSION_NAME.indexOf("_", index + 1));
                    sDesc += " client";
                }
            }
        }

        return sDesc;
    }


}