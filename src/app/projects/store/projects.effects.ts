import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initRedmineProjects, loadRedmineProjects, initSoftDevProjects, loadSoftDevProjects, fillProjectById, noopAction, setRedmineProjectsFilter, setSoftDevProjectsFilter, resetProjectCreationForm, setVersionRedmineProjectsFilter, setVersionSoftDevProjectsFilter, setVersionDataBaseonSDProject, resetVersionCreationForm } from './projects.actions';
import { RedmineProject } from '../../shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { Store } from '@ngrx/store';
import * as fromProjectsState from './state/projects.state';
import * as fromProjectState from './state/projects.project-creation-state';
import * as fromSharedState from '../../shared/store/shared.state';
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction, box } from 'ngrx-forms';
import { PROJECT_CREATION_DIALOG, PROJECT_CREATION_FORMID } from './state/projects.project-creation-state';
import { validateIdentifier, validateProject, validateSDProject, validateVersionName, validateVersionProject, validateVersionSDProject } from './projects.validation';
import { getProjectCreationDialogState, getProjectCreationFormState, getSoftDevProjects, getVersionCreationFormState } from './projects.selectors';
import { formatDate } from '@angular/common';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { GsdaRedmineHttpResponse } from 'src/app/shared/http/model/gsda-redmine-http-response.model';
import { SnackBarIcon } from '../../shared/store/shared.state';
import { VERSION_CREATION_FORMID } from './state/prjects.version-creation-state';

const GET_SD_PROJECTS_URL = environment.apiUrl + '/softdev/projects/get-softdev-projects';
const GET_REDMINE_PROJECTS_URL = environment.apiUrl + '/redmine/items/get-redmine-projects';

export const validateProjectError = "validateProjectError";
export const validateSDProjectError = "validateSDProjectError";
export const validateIdentifierError = "validateIdentifierError";
export const validateNameError = "validateNameError";
export const validateDueDateError = "validateDueDateError";

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
            if (action.controlId === PROJECT_CREATION_FORMID + '.parent_project')
                return from(validateProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilter())));

            if (action.controlId === PROJECT_CREATION_FORMID + '.identifier')
                return from(validateIdentifier(this.store, this.http, validateIdentifierError, action.controlId, action.value));

            if (action.controlId === PROJECT_CREATION_DIALOG + '.projectId')
                return from(validateSDProject(this.store, validateSDProjectError, action.controlId, action.value).pipe(startWith(setSoftDevProjectsFilter())));

            if (action.controlId === VERSION_CREATION_FORMID + '.redmine_project')
                return from(validateVersionProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setVersionRedmineProjectsFilter())));

            if (action.controlId === VERSION_CREATION_FORMID + '.sd_project')
                return from(validateVersionSDProject(this.store, validateSDProjectError, action.controlId, action.value).pipe(startWith(setVersionSoftDevProjectsFilter())));

            if (action.controlId === VERSION_CREATION_FORMID + '.name')
                return from(validateVersionName(this.store, validateNameError, action.controlId, action.value));

            return of(noopAction());
        })
    ));

    projectCreationFormSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == PROJECT_CREATION_FORMID) {
                if (action.name == fromSharedState.FORM_SAVE_STATE) {
                    if (action.value == fromSharedState.FormSaveState.Saving || action.value == fromSharedState.FormSaveState.SavingWithRedirect) {

                        return this.store.select(getProjectCreationFormState).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.post<GsdaRedmineHttpResponse>(environment.apiUrl + '/redmine/projects/create-redmine-project', formData.value, { context }).pipe(switchMap(response => {
                                if (response.success) {
                                    if (action.value == fromSharedState.FormSaveState.SavingWithRedirect && response.redmineLink) {
                                        window.location.href = response.redmineLink;
                                    }

                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Project saved', icon: SnackBarIcon.Success }));
                                    return of(resetProjectCreationForm());
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                    return of(new SetUserDefinedPropertyAction(fromProjectState.PROJECT_CREATION_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during adding project", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(fromProjectState.PROJECT_CREATION_FORMID,
                                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                            }))
                        }))
                    }
                }
            }

            if (action.controlId == VERSION_CREATION_FORMID) {
                if (action.name == fromSharedState.FORM_SAVE_STATE) {
                    if (action.value == fromSharedState.FormSaveState.Saving || action.value == fromSharedState.FormSaveState.SavingWithRedirect) {
                        return this.store.select(getVersionCreationFormState).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.post<GsdaRedmineHttpResponse>(environment.apiUrl + '/redmine/projects/create-redmine-version', formData.value, { context }).pipe(switchMap(response => {
                                if (response.success) {
                                    if (action.value == fromSharedState.FormSaveState.SavingWithRedirect && response.redmineLink) {
                                        window.location.href = response.redmineLink;
                                    }

                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Version saved', icon: SnackBarIcon.Success }));
                                    return of(resetVersionCreationForm());
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                    return of(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during adding project", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID,
                                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                            }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));

    resetProjectCreationForm$ = createEffect(() => this.actions$.pipe(ofType(resetProjectCreationForm),
        switchMap(() => {
            return of(new SetValueAction(fromProjectState.PROJECT_CREATION_DIALOG + '.projectId', ''),
                new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.name', ''),
                new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.identifier', ''),
                new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.description', ''),
                new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.wiki', ''),
                new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.parent_project', ''),
                new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.inherit_public', box(['Public'])),
                new SetUserDefinedPropertyAction(fromProjectState.PROJECT_CREATION_FORMID,
                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New),
                new ResetAction(fromProjectState.PROJECT_CREATION_FORMID));
        })
    ));

    getProjectById$ = createEffect(() => this.actions$.pipe(
        ofType(fillProjectById),
        switchMap(() => {
            return this.store.select(getProjectCreationDialogState).pipe(take(1), switchMap(dialogData => {
                return this.store.select(getSoftDevProjects).pipe(take(1), mergeMap(sdProjects => {
                    let sdProject = sdProjects.find((sd: { PRODUCT_VERSION_NAME: string; }) => sd.PRODUCT_VERSION_NAME == dialogData.controls.projectId.value);
                    if (sdProject) {
                        return of(new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.identifier', sdProject.PRODUCT_VERSION_NAME.replace(/\./g, "_").toLocaleLowerCase()),
                            new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.name', sdProject.PRODUCT_VERSION_NAME),
                            new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.description', this.createDescription(sdProject)),
                            new SetValueAction(fromProjectState.PROJECT_CREATION_FORMID + '.wiki', this.createWikiInformation(sdProject)));
                    }

                    return of(noopAction());
                }))
            }), catchError(error => {
                console.log(error);
                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting", icon: SnackBarIcon.Error }));
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
        sWiki += `* *Delivery Date: ${formatDate(sdProject.PRODUCT_DELIVERY_DATE, "MM/dd/yyyy", 'en-US')}* \n\n`;
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


    setVersionDataBaseonSDProject$ = createEffect(() => this.actions$.pipe(
        ofType(setVersionDataBaseonSDProject),
        switchMap(() => {
            return this.store.select(getVersionCreationFormState).pipe(take(1), switchMap(versionFormData => {
                return this.store.select(getSoftDevProjects).pipe(take(1), mergeMap(sdProjects => {
                    let sdProject = sdProjects.find((sd: { PRODUCT_VERSION_NAME: string; }) => sd.PRODUCT_VERSION_NAME == versionFormData.controls.sd_project.value);
                    if (sdProject) {
                        return of(new SetValueAction(VERSION_CREATION_FORMID + '.name', sdProject.PRODUCT_VERSION_NAME),
                            new SetValueAction(VERSION_CREATION_FORMID + '.description', sdProject.PROJECT_NAME),
                            new SetValueAction(VERSION_CREATION_FORMID + '.due_date', sdProject.PRODUCT_DELIVERY_DATE),
                            new SetValueAction(VERSION_CREATION_FORMID + '.wiki_title', sdProject.PRODUCT_VERSION_NAME.replace(/\./g, "_").toLocaleLowerCase()),
                            new SetValueAction(VERSION_CREATION_FORMID + '.wiki', this.createWikiInformation(sdProject)));
                    }

                    return of(noopAction());
                }))
            }), catchError(error => {
                console.log(error);
                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting!", icon: SnackBarIcon.Error }));
                return of(noopAction());
            }))
        })
    ));


    resetVersionCreationForm$ = createEffect(() => this.actions$.pipe(ofType(resetVersionCreationForm),
        switchMap(() => {
            return of(new SetValueAction(VERSION_CREATION_FORMID + '.redmine_project', ''),
                new SetValueAction(VERSION_CREATION_FORMID + '.sd_project', ''),
                new SetValueAction(VERSION_CREATION_FORMID + '.name', ''),
                new SetValueAction(VERSION_CREATION_FORMID + '.description', ''),
                new SetValueAction(VERSION_CREATION_FORMID + '.wiki_title', ''),
                new SetValueAction(VERSION_CREATION_FORMID + '.due_date', ''),
                new SetValueAction(VERSION_CREATION_FORMID + '.sharing', 'descendants'),
                new SetValueAction(VERSION_CREATION_FORMID + '.wiki', ''),
                new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID,
                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New),
                new ResetAction(VERSION_CREATION_FORMID));
        })
    ));
}