import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { catchError, endWith, map, mergeMap, of, switchMap, take, from, startWith } from "rxjs";
import * as fromItemsState from '../state/items.state';
import * as fromSharedState from '../../../shared/store/shared.state';
import * as fromAuthState from '../../../auth/store/auth.state'
import * as fromAuthStateSelectors from '../../../auth/store/auth.selectors'

import { noopAction } from '../actions/items.common-actions';
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { ITEMS_FROM_EMAILS_SETTINGS_FORMID } from '../state/items.items-from-emails-state';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';

import { environment } from 'src/environments/environment';
import { getItemsFromEmailsSettingsFormData } from '../selectors/items.items-from-emails-selectors';
import { GsdaHttpResponse } from 'src/app/shared/http/model/gsda-http-response.model';
import { clearRedmineVersionsForItemsFromEmail, endInitItemsFromEmailsSettings, initItemsFromEmailsSettings, initRedmineVersionsForItemsFromEmail, loadRedmineVersionsForItemsFromEmail, setRedmineProjectsFilterForItemsFromEmail, setRedmineUsersByLetterFilterForItemsFromEmail } from '../actions/items.items-from-emails.actions';
import { ItemsFromEmailSettingsHttpResponse } from '../models/itemsfromemails/Items-from-email-settings-http-response.model';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { validateItemsFromEmailsSettingsName, validateProject, validateUser } from '../items.validation';

export const validateItemsFromEmailsError = "validateItemsFromEmailsError";

@Injectable()
export class ItemsFromEmailsEffects {

    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private authStore: Store<fromAuthState.State>,
        private http: HttpClient) { }

    settingsFormEmailSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {

            if (action.controlId === ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.name')
                return from(validateItemsFromEmailsSettingsName(this.store, validateItemsFromEmailsError, action.controlId, action.value));

            if (action.controlId === ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.project')
                return from(validateProject(this.store, validateItemsFromEmailsError, action.controlId,
                    action.value, clearRedmineVersionsForItemsFromEmail(), initRedmineVersionsForItemsFromEmail({ projectName: action.value })).pipe(startWith(setRedmineProjectsFilterForItemsFromEmail())));

            if (action.controlId === ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.user')
                return from(validateUser(this.store, validateItemsFromEmailsError, action.controlId, action.value).pipe(startWith(setRedmineUsersByLetterFilterForItemsFromEmail())));

            return of(noopAction());
        })
    ));

    settingsFormEmailSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == ITEMS_FROM_EMAILS_SETTINGS_FORMID) {
                if (action.name == fromSharedState.FORM_SAVE_STATE) {
                    if (action.value == fromSharedState.FormSaveState.Saving) {

                        return this.store.select(getItemsFromEmailsSettingsFormData).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                            const dataToSave = {
                                formId: ITEMS_FROM_EMAILS_SETTINGS_FORMID,
                                values: formData.value
                            }
                            return this.http.post<GsdaHttpResponse>(environment.apiUrl + '/gsda/items-from-emails/save-items-from-emails-settings', dataToSave, { context }).pipe(switchMap(response => {
                                if (response.success) {

                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Items From Emails Settings saved', icon: fromSharedState.SnackBarIcon.Success }));

                                    return this.authStore.select(fromAuthStateSelectors.getUserLogin).pipe(take(1),
                                        map(modifiedBy => new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.modifiedBy', modifiedBy)),
                                        endWith(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID,
                                            fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New)));
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));

                                    return of(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during saving Settings", icon: fromSharedState.SnackBarIcon.Error }));

                                return of(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID,
                                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                            }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));

    initItemsFromEmailsSettings$ = createEffect(() => this.actions$.pipe(
        ofType(initItemsFromEmailsSettings),
        switchMap(() => {

            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

            return this.http.get<ItemsFromEmailSettingsHttpResponse>(environment.apiUrl + '/gsda/items-from-emails/get-items-from-emails-settings',
                { context })
                .pipe(mergeMap(response => {

                    if (response.success) {
                        return of(

                            endInitItemsFromEmailsSettings({ records: response.records }));
                    }
                    else {
                        console.log('ERROR');
                        console.log(response.errorMessage);
                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));
                        return of(noopAction());
                    }
                }));
        }),
        catchError(error => {
            console.log(error);
            this.sharedStore.dispatch(addSnackbarNotification({ notification: "Cannot load Settings from DB", icon: fromSharedState.SnackBarIcon.Error }));
            return of(noopAction());
        }))
    );

    initRedmineVersionsForItemsFromEmail$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersionsForItemsFromEmail),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersionsForItemsFromEmail({ redmineVersions }))
    ));
}