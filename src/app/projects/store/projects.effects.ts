import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initRedmineProjects, loadRedmineProjects, initSoftDevProjects, loadSoftDevProjects, fillProjectById, noopAction, setRedmineProjectsFilter, setSoftDevProjectsFilter, resetProjectCreationForm, setVersionRedmineProjectsFilter, setVersionSoftDevProjectsFilter, setVersionDataBaseonSDProject, resetVersionCreationForm, initRedmineVersions, loadRedmineVersions, resetPartiallyVersionCreationForm, fillVersionFormByVersion, refreshVersions, endRefreshingVersions, refreshRedmineProjects, endRefreshingRedmineProjects, refreshSDProjects, endRefreshingSDProjects } from './projects.actions';
import { RedmineProject } from '../../shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { Store } from '@ngrx/store';
import * as fromProjectsState from './state/projects.state';
import * as fromProjectState from './state/projects.project-creation-state';
import * as fromSharedState from '../../shared/store/shared.state';
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction, box } from 'ngrx-forms';
import { PROJECT_CREATION_DIALOG, PROJECT_CREATION_FORMID } from './state/projects.project-creation-state';
import { validateIdentifier, validateProject, validateSDProject, validateVersionName, validateVersionProject, validateVersionSDProject, validateVersionVersion } from './projects.validation';
import { getProjectCreationDialogState, getProjectCreationFormState, getRedmineVersionsByProject, getSoftDevProjects, getVersionCreationFormState } from './projects.selectors';
import { formatDate } from '@angular/common';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { GsdaRedmineHttpResponse } from 'src/app/shared/http/model/gsda-redmine-http-response.model';
import { SnackBarIcon } from '../../shared/store/shared.state';
import { VERSION_CREATION_FORMID } from './state/prjects.version-creation-state';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { RefreshCacheHttpResponse } from 'src/app/setup/store/models/refreshCache-response.model';

const GET_SD_PROJECTS_URL = environment.apiUrl + '/softdev/projects/get-softdev-projects';
const GET_REDMINE_PROJECTS_URL = environment.apiUrl + '/redmine/items/get-redmine-projects';

export const validateProjectError = "validateProjectError";
export const validateSDProjectError = "validateSDProjectError";
export const validateIdentifierError = "validateIdentifierError";
export const validateNameError = "validateNameError";
export const validateDueDateError = "validateDueDateError";
export const validateVersionError = "validateVersionError";

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

            if (action.controlId === VERSION_CREATION_FORMID + '.version')
                return from(validateVersionVersion(this.store, validateVersionError, action.controlId, action.value));

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
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during adding version", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID,
                                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                            }))
                        }))
                    }
                } else if (action.name == fromSharedState.FORM_UPDATE_STATE) {
                    if (action.value == fromSharedState.FormUpdateState.Updating || action.value == fromSharedState.FormUpdateState.UpdatingWithRedirect) {
                        return this.store.select(getVersionCreationFormState).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.post<GsdaRedmineHttpResponse>(environment.apiUrl + '/redmine/projects/update-redmine-version', formData.value, { context }).pipe(switchMap(response => {
                                if (response.success) {
                                    if (action.value == fromSharedState.FormUpdateState.UpdatingWithRedirect && response.redmineLink) {
                                        window.location.href = response.redmineLink;
                                    }

                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Version updated', icon: SnackBarIcon.Success }));
                                    return of(resetVersionCreationForm());
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                    return of(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID,
                                        fromSharedState.FORM_UPDATE_STATE, fromSharedState.FormUpdateState.New));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during updating version", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID,
                                    fromSharedState.FORM_UPDATE_STATE, fromSharedState.FormUpdateState.New));
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
        sWiki += `* ${sdProject.PRODUCT_BRANCH} \n\n`;
        sWiki += `h2. EDD Approvals \n\n`;
        sWiki += `* *${sdProject.EDD_APPROVALS}* \n\n`;
        sWiki += `h2. PRG Activities \n\n`;
        sWiki += `<pre>${sdProject.PRG_ACTIVITIES}</pre>`

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
                        return of(versionFormData.controls.version.value.length > 0 ? noopAction():new SetValueAction(VERSION_CREATION_FORMID + '.name', sdProject.PRODUCT_VERSION_NAME),
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
                new SetValueAction(VERSION_CREATION_FORMID + '.version', ''),
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

    resetPartiallyVersionCreationForm$ = createEffect(() => this.actions$.pipe(ofType(resetPartiallyVersionCreationForm),
        switchMap(() => {
            return of(new SetValueAction(VERSION_CREATION_FORMID + '.name', ''),
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

    /*setEmptyVersion$ = createEffect(() => this.actions$.pipe(
        ofType(setEmptyVersion),
        switchMap(() => {
            return of(new SetValueAction(VERSION_CREATION_FORMID + '.version', ' '));
        })
    ));*/

    initRedmineVersions$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersions),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersions({ redmineVersions }))
    ));

    fillVersionFormByVersion$ = createEffect(() => this.actions$.pipe(
        ofType(fillVersionFormByVersion),
        switchMap(() => {
            return this.store.select(getVersionCreationFormState).pipe(take(1), switchMap(versionFormData => {
                return this.store.select(getRedmineVersionsByProject).pipe(take(1), mergeMap(versions => {
                    let version = versions.find((ver) => ver.name == versionFormData.controls.version.value);
                    if (version) {
                        return of(new SetValueAction(VERSION_CREATION_FORMID + '.name', version.name),
                            new SetValueAction(VERSION_CREATION_FORMID + '.description', version.description),
                            new SetValueAction(VERSION_CREATION_FORMID + '.due_date', version.due_date),
                            new SetValueAction(VERSION_CREATION_FORMID + '.wiki_title', version.wiki_page_title),
                            new SetValueAction(VERSION_CREATION_FORMID + '.sharing', version.sharing),
                            new SetValueAction(VERSION_CREATION_FORMID + '.wiki', version.wiki),
                            new SetValueAction(VERSION_CREATION_FORMID + '.sd_project', ''));
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

    refreshVersions$ = createEffect(() => this.actions$.pipe(
        ofType(refreshVersions),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-versions').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Versions refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return this.store.select(getVersionCreationFormState).pipe(take(1), switchMap(versionCreationForm => {
                    return of(initRedmineVersions({projectName: versionCreationForm.value.redmine_project}), endRefreshingVersions());
                }))
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
                return of(initRedmineProjects(), endRefreshingRedmineProjects());
            }))
        })
    ));

    refreshSDProjects$ = createEffect(() => this.actions$.pipe(
        ofType(refreshSDProjects),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-sd-projects').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'SoftDev Projects refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return of(initSoftDevProjects(), endRefreshingSDProjects());
            }))
        })
    ));
}