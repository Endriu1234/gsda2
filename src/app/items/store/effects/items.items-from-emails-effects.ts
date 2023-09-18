import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import * as fromItemsState from '../state/items.state';
import * as fromSharedState from '../../../shared/store/shared.state';


import { noopAction } from '../actions/items.common-actions';
import { SetUserDefinedPropertyAction } from 'ngrx-forms';
import { ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID } from '../state/items.items-from-emails-state';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';

import { environment } from 'src/environments/environment';
import { getItemsFromEmailsGeneralSettingsFormData } from '../selectors/items.items-from-emails-selectors';
import { GsdaHttpResponse } from 'src/app/shared/http/model/gsda-http-response.model';

@Injectable()
export class ItemsFromEmailsEffects {

    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient) { }

    generalSettingsFormSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID) {
                if (action.name == fromSharedState.FORM_SAVE_STATE) {
                    if (action.value == fromSharedState.FormSaveState.Saving) {

                        return this.store.select(getItemsFromEmailsGeneralSettingsFormData).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.post<GsdaHttpResponse>(environment.apiUrl + '/gsda/items-from-emails/save-items-from-emails-settings', formData.value, { context }).pipe(switchMap(response => {
                                if (response.success) {

                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'General Settings saved', icon: fromSharedState.SnackBarIcon.Success }));

                                    return of(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: fromSharedState.SnackBarIcon.Error }));

                                    return of(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during saving General Settings", icon: fromSharedState.SnackBarIcon.Error }));

                                return of(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID,
                                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                            }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));
}