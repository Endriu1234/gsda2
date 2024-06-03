import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromItemsState from '../state/items.state';
import * as fromSharedState from '../../../shared/store/shared.state';
import { Store } from '@ngrx/store';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import { validateProject, validateUser, validateCR, validateIssue, validateTms, validateFromId } from '../items.validation';
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { GsdaRedmineHttpResponse } from 'src/app/shared/http/model/gsda-redmine-http-response.model';
import { environment } from 'src/environments/environment';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { Item } from '../models/item.model';
import {
    breakBatchItemCreation, clearRedmineVersions, endLoadingItemCreationUserPreferences, endRefreshingVersions, endResetItemCreationForm, fillItemById, identifyAndFillItemById, initRedmineVersions,
    loadItemCreationUserPreferencesSetup,
    loadRedmineVersions, refreshVersions, saveItemCreationUserPreferences, setItemControlsByUserPreferences, setItemCreationUserPreferencesSetupByCtrl, setRedmineProjectsFilterForItemCreation, setRedmineUsersByLetterFilter, startLoadingItemCreationUserPreferences, startResetItemCreationForm
} from '../actions/items.item-creation-actions';
import { noopAction } from '../actions/items.common-actions';
import { getItemCreationDialogState, getItemCreationFormState, getItemCreationFormWithSetup, getItemCreationMode, getItemCreationUserPreferencesSetupData } from '../selectors/items.item-creation-selectors';
import { ITEM_CREATION_DIALOG, ITEM_CREATION_FORMID, ITEM_CREATION_USER_PREFERENCES_DIALOG, ItemCreationMode } from '../state/items.item-creation-state';
import { SnackBarIcon } from '../../../shared/store/shared.state';
import { continueBatchItemsCreation, forceEndBatchItemCreation, setLinkToCurrentProposedItemAndUnselect } from '../actions/items.batch-item-creation-actions';
import { RedmineVersion } from '../../../shared/store/models/redmine-version.model';
import { UserPreferencesHttpResponse } from '../models/itemcreation/userPreferences-http-response.model';
import { RefreshCacheHttpResponse } from 'src/app/setup/store/models/refreshCache-response.model';

export const validateUserError = "validateUserError";
export const validateCRError = "validateCRError";
export const validateIssueError = "validateIssueError";
export const validateTmsError = "validateTmsError";
export const validateFromIdError = "validateFromIdError";
export const validateProjectError = "validateProjectError";

@Injectable()
export class ItemsItemCreationEffects {
    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient) { }

    itemCreationFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {

            return this.store.select(getItemCreationMode).pipe(take(1), switchMap(creationMode => {

                if (creationMode === ItemCreationMode.BatchItemWithoutGUI)
                    return [noopAction()];

                if (action.controlId === ITEM_CREATION_FORMID + '.project')
                    return from(validateProject(this.store, validateProjectError, action.controlId,
                        action.value, clearRedmineVersions(), initRedmineVersions({ projectName: action.value })).pipe(startWith(setRedmineProjectsFilterForItemCreation())));

                if (action.controlId === ITEM_CREATION_FORMID + '.user')
                    return from(validateUser(this.store, validateUserError, action.controlId, action.value, false).pipe(startWith(setRedmineUsersByLetterFilter())));

                if (action.controlId === ITEM_CREATION_FORMID + '.cr')
                    return from(validateCR(this.store, this.http, validateCRError, action.controlId, action.value));

                if (action.controlId === ITEM_CREATION_FORMID + '.issue')
                    return from(validateIssue(this.store, this.http, validateIssueError, action.controlId, action.value));

                if (action.controlId === ITEM_CREATION_FORMID + '.tms')
                    return from(validateTms(this.store, this.http, validateTmsError, action.controlId, action.value));

                if (action.controlId === ITEM_CREATION_DIALOG + '.fromId')
                    return from(validateFromId(this.store, this.http, validateFromIdError, action.controlId, action.value));

                if (action.controlId === ITEM_CREATION_FORMID + '.version')
                    return of(setItemCreationUserPreferencesSetupByCtrl({control: ITEM_CREATION_FORMID + '.version'}));

                if (action.controlId === ITEM_CREATION_FORMID + '.tracker')
                    return of(setItemCreationUserPreferencesSetupByCtrl({control: ITEM_CREATION_FORMID + '.tracker'}));

                return of(noopAction());
            }));
        })
    ));

    itemCreationFormSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == ITEM_CREATION_FORMID) {
                if (action.name == fromSharedState.FORM_SAVE_STATE) {
                    if (action.value == fromSharedState.FormSaveState.Saving || action.value == fromSharedState.FormSaveState.SavingWithRedirect) {

                        return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);


                            const postData = new FormData();
                            Object.keys(formData.creationFormState.value as any).forEach(key => {

                                if (key === 'files') {
                                    const files = (formData.creationFormState.value as any)[key];
                                    if (files.length > 0) {
                                        files.forEach((file: File) => {
                                            postData.append('files', file, file.name);
                                        });
                                    }
                                }
                                else {
                                    const value = (formData.creationFormState.value as any)[key];


                                    if (value)
                                        postData.append(key, (formData.creationFormState.value as any)[key]);
                                }

                            });

                            return this.http.post<GsdaRedmineHttpResponse>(environment.apiUrl + '/redmine/items/create-redmine-item', postData, { context }).pipe(switchMap(response => {
                                if (response.success) {

                                    if (formData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {

                                        if (action.value == fromSharedState.FormSaveState.SavingWithRedirect && response.redmineLink) {

                                            window.location.href = response.redmineLink;
                                        }

                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved', icon: SnackBarIcon.Success }));
                                        
                                        return of(saveItemCreationUserPreferences({updateSetup: false}), startResetItemCreationForm());
                                    }
                                    else if (formData.creationFormSetupState.mode === ItemCreationMode.BatchItemWithGUI
                                        || formData.creationFormSetupState.mode === ItemCreationMode.BatchItemWithoutGUI) {

                                        if (formData.creationFormSetupState.mode === ItemCreationMode.BatchItemWithGUI)
                                            this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved', icon: SnackBarIcon.Success }));

                                        return of(setLinkToCurrentProposedItemAndUnselect({ redmineLink: response.redmineLink }), continueBatchItemsCreation());
                                    }
                                    else if (formData.creationFormSetupState.mode === ItemCreationMode.BatchItemSingleRecord) {
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved', icon: SnackBarIcon.Success }));
                                        return of(setLinkToCurrentProposedItemAndUnselect({ redmineLink: response.redmineLink }), forceEndBatchItemCreation({withRedirection: true}));
                                    }

                                    return of(noopAction());
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));

                                    if (formData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                                        return of(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID,
                                            fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                    }

                                    return of(forceEndBatchItemCreation({withRedirection: true}));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during adding item", icon: SnackBarIcon.Error }));

                                if (formData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                                    return of(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }

                                return of(forceEndBatchItemCreation({withRedirection: true}));
                            }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));

    startResetItemCreationForm$ = createEffect(() => this.actions$.pipe(ofType(startResetItemCreationForm),
        switchMap(() => {
            return of(new SetValueAction(ITEM_CREATION_FORMID + '.project', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.tracker', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.subject', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.description', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.user', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.issue', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.cr', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.tms', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.version', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.est_time', ''),
                new SetValueAction(ITEM_CREATION_FORMID + '.files', []),
                new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID,
                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New),
                new ResetAction(ITEM_CREATION_FORMID), endResetItemCreationForm());
        })
    ));

    endResetItemCreationForm$ = createEffect(() => this.actions$.pipe(ofType(endResetItemCreationForm),
        switchMap(() => {

            return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(itemFormData => {
                if (itemFormData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                    return this.store.select(getItemCreationUserPreferencesSetupData).pipe(take(1), switchMap(userPreferencesSetup => {                   
                        return of(setItemControlsByUserPreferences({preferences: userPreferencesSetup.userPreferences}));
                    }))
                }
                return of(noopAction());
            }))
        })
    ));

    getItemById$ = createEffect(() => this.actions$.pipe(
        ofType(fillItemById),
        switchMap(() => {
            return this.store.select(getItemCreationDialogState).pipe(take(1), switchMap(dialogData => {
                let params = new HttpParams();
                params = params.append("id", dialogData.controls.fromId.value);
                let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                return this.http.get<Item>(environment.apiUrl + '/softdev/items/get-item-by-id', { params, context }).pipe(mergeMap(item => {
                    return of(new SetValueAction(ITEM_CREATION_FORMID + '.subject', item.item_summary),
                        new SetValueAction(ITEM_CREATION_FORMID + '.description', item.item_description),
                        new SetValueAction(ITEM_CREATION_FORMID + '.issue', item.issue_id),
                        new SetValueAction(ITEM_CREATION_FORMID + '.cr', item.cr_id),
                        new SetValueAction(ITEM_CREATION_FORMID + '.tms', item.tms_id),
                        new SetValueAction(ITEM_CREATION_FORMID + '.est_time', item.cr_est_hours),
                        new SetValueAction(ITEM_CREATION_FORMID + '.tracker', item.tracker))
                }))
            }), catchError(error => {
                console.log(error);
                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting", icon: SnackBarIcon.Error }));
                return of(noopAction());
            }))
        })
    ));

    identifyAndFillItemById$ = createEffect(() => this.actions$.pipe(
        ofType(identifyAndFillItemById),
        switchMap(() => {
            return this.store.select(getItemCreationFormState).pipe(take(1), switchMap(formData => {
                let params = new HttpParams();
                let id = "";
                if (formData.controls.issue && formData.controls.issue.value) {
                    id = formData.controls.issue.value;
                } else if (formData.controls.cr && formData.controls.cr.value) {
                    id = formData.controls.cr.value;
                } else if (formData.controls.tms && formData.controls.tms.value) {
                    id = formData.controls.tms.value;
                }
                params = params.append("id", id);
                let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                return this.http.get<Item>(environment.apiUrl + '/softdev/items/get-item-by-id', { params, context }).pipe(mergeMap(item => {
                    return of(new SetValueAction(ITEM_CREATION_FORMID + '.subject', item.item_summary),
                        new SetValueAction(ITEM_CREATION_FORMID + '.description', item.item_description),
                        new SetValueAction(ITEM_CREATION_FORMID + '.issue', item.issue_id),
                        new SetValueAction(ITEM_CREATION_FORMID + '.cr', item.cr_id),
                        new SetValueAction(ITEM_CREATION_FORMID + '.tms', item.tms_id),
                        new SetValueAction(ITEM_CREATION_FORMID + '.est_time', item.cr_est_hours),
                        new SetValueAction(ITEM_CREATION_FORMID + '.tracker', item.tracker))
                }))
            }), catchError(error => {
                console.log(error);
                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting", icon: SnackBarIcon.Error }));
                return of(noopAction());
            }))
        })
    ));

    breakBatchItemCreation$ = createEffect(() => this.actions$.pipe(
        ofType(breakBatchItemCreation),
        switchMap(() => {
            this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item(s) Creation aborted.', icon: SnackBarIcon.Info }));
            return of(forceEndBatchItemCreation({withRedirection: true}));
        })
    ));

    initRedmineVersions$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersions),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersions({ redmineVersions }))
    ));

    startLoadingItemCreationUserPreferences$ = createEffect(() => this.actions$.pipe(
        ofType(startLoadingItemCreationUserPreferences),
        switchMap(() => {
            return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(itemFormData => {
                if (itemFormData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                    let params = new HttpParams();
                    params = params.append("formId", ITEM_CREATION_FORMID);

                    return this.http.get<UserPreferencesHttpResponse>(environment.apiUrl + '/gsda/user-preferences/get-user-preferences', { params }).pipe(mergeMap(response => {
                        if (response.success) {
                            if (response.records && response.records.formId === ITEM_CREATION_FORMID) {
                                return of(endLoadingItemCreationUserPreferences({preferences: response.records}));
                            } else {
                                return of(endLoadingItemCreationUserPreferences({preferences: null}));
                            }
                        } else {
                            this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                            return of(endLoadingItemCreationUserPreferences({preferences: null}));
                        }
                    }), catchError(error => {
                        console.log(error);
                        this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during loading user preferences", icon: SnackBarIcon.Error }));
                        return of(endLoadingItemCreationUserPreferences({preferences: null}));
                    }))
                }
                return of(noopAction());
            }))
        })
    ));

    endLoadingItemCreationUserPreferences$ = createEffect(() => this.actions$.pipe(
        ofType(endLoadingItemCreationUserPreferences),
        switchMap((param) => {
            return of(setItemControlsByUserPreferences(param));
        })
    ));

    setItemControlsByUserPreferences$ = createEffect(() => this.actions$.pipe(
        ofType(setItemControlsByUserPreferences),
        switchMap((param) => {
            return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(itemFormData => {
                if (itemFormData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                    if (param && param.preferences) {
                        return of(param.preferences.currentValues.project.length > 0 && param.preferences.setupValues.rememberProject ? new SetValueAction(ITEM_CREATION_FORMID + '.project', param.preferences.currentValues.project) : noopAction(),
                                param.preferences.currentValues.version.length > 0  && param.preferences.setupValues.rememberVersion ? new SetValueAction(ITEM_CREATION_FORMID + '.version', param.preferences.currentValues.version) : noopAction(),
                                param.preferences.currentValues.tracker.length > 0  && param.preferences.setupValues.rememberTracker ? new SetValueAction(ITEM_CREATION_FORMID + '.tracker', param.preferences.currentValues.tracker) : noopAction(),
                                param.preferences.currentValues.user.length > 0  && param.preferences.setupValues.rememberUser ? new SetValueAction(ITEM_CREATION_FORMID + '.user', param.preferences.currentValues.user) : noopAction())
                    } else {
                        return of(noopAction());
                    }
                }
                return of(noopAction());
            }))
        })
    ));

    loadItemCreationUserPreferencesSetup$ = createEffect(() => this.actions$.pipe(
        ofType(loadItemCreationUserPreferencesSetup),
        switchMap(() => {
            return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(itemFormData => {
                if (itemFormData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                    return this.store.select(getItemCreationUserPreferencesSetupData).pipe(take(1), switchMap(userPreferencesSetup => {
                    
                        if (userPreferencesSetup.userPreferences) {
                            return of(new SetValueAction(ITEM_CREATION_USER_PREFERENCES_DIALOG + '.rememberProject', userPreferencesSetup.userPreferences.setupValues.rememberProject),
                                    new SetValueAction(ITEM_CREATION_USER_PREFERENCES_DIALOG + '.rememberVersion', userPreferencesSetup.userPreferences.setupValues.rememberVersion),
                                    new SetValueAction(ITEM_CREATION_USER_PREFERENCES_DIALOG + '.rememberTracker', userPreferencesSetup.userPreferences.setupValues.rememberTracker),
                                    new SetValueAction(ITEM_CREATION_USER_PREFERENCES_DIALOG + '.rememberUser', userPreferencesSetup.userPreferences.setupValues.rememberUser));
                        } else {
                            return of(noopAction());
                        }
                    }))
                }
                return of(noopAction());
            }))
        })
    ))

    saveItemCreationUserPreferences$ = createEffect(() => this.actions$.pipe(
        ofType(saveItemCreationUserPreferences),
        switchMap((param) => {
            return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(itemFormData => {
                if (itemFormData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                    return this.store.select(getItemCreationUserPreferencesSetupData).pipe(take(1), switchMap(userPreferencesSetup => {
                        let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                        return this.http.post<UserPreferencesHttpResponse>(environment.apiUrl + '/gsda/user-preferences/save-user-preferences', userPreferencesSetup.userPreferences, { context }).pipe(switchMap(response => {
                            if (response.success) {
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: 'User preferences saved', icon: SnackBarIcon.Success }));
                            } else {
                                console.log(response.errorMessage);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                            }
                            return of(noopAction());
                        }), catchError(error => {
                            console.log(error);
                            this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during saving preferences", icon: SnackBarIcon.Error }));

                            return of(noopAction());
                        }))
                    }))
                }
                return of(noopAction());
            }))
        })
    ))

    refreshVersions$ = createEffect(() => this.actions$.pipe(
        ofType(refreshVersions),
        switchMap(() => {
            return this.http.get<RefreshCacheHttpResponse>(environment.apiUrl + '/redmine/setup/refresh-versions').pipe(mergeMap(response => {
                if (response.success) {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Versions refreshed', icon: fromSharedState.SnackBarIcon.Success }));
                } else {
                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                }
                return this.store.select(getItemCreationFormState).pipe(take(1), switchMap(itemCreationForm => {
                    return of(initRedmineVersions({projectName: itemCreationForm.value.project}), endRefreshingVersions());
                }))
            }))
        })
    ));
}
