import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromItemsState from './items.state';
import * as fromSharedState from '../../shared/store/shared.state';
import { Store } from '@ngrx/store';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import { validateProject, validateUser, validateCR, validateIssue, validateTms, validateFromId } from './items.validation';
import { ITEM_CREATION_FORMID, ITEM_CREATION_DIALOG } from './items.state';
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { findItemById, noopAction, resetItemCreationForm, setRedmineProjectsFilterForItemCreation, setRedmineUsersByLetterFilter } from './items.actions';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { getItemCreationFormState } from './items.selectors';
import { GsdaRedmineHttpResponse } from 'src/app/shared/http/model/gsda-redmine-http-response.model';
import { environment } from 'src/environments/environment';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { Item } from './models/item.model';



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
            if (action.controlId === ITEM_CREATION_FORMID + '.project')
                return from(validateProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilterForItemCreation())));

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

    itemCreationFormSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == ITEM_CREATION_FORMID) {
                if (action.name == fromSharedState.FORM_SAVE_STATE) {
                    if (action.value == fromSharedState.FormSaveState.Saving || action.value == fromSharedState.FormSaveState.SavingWithRedirect) {

                        return this.store.select(getItemCreationFormState).pipe(take(1), switchMap(formData => {
                            console.log("Saving form data:");
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.post<GsdaRedmineHttpResponse>(environment.apiUrl + '/redmine/items/create-redmine-item', formData.value, { context }).pipe(switchMap(response => {
                                if (response.success) {
                                    if (action.value == fromSharedState.FormSaveState.SavingWithRedirect && response.redmineLink) {

                                        window.location.href = response.redmineLink;
                                    }

                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved' }));
                                    return of(
                                        resetItemCreationForm(),
                                        new SetUserDefinedPropertyAction(fromItemsState.ITEM_CREATION_FORMID,
                                            fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.SavingSuccessful));
                                }
                                else {
                                    console.log(response.errorMessage);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage }));
                                    return of(new SetUserDefinedPropertyAction(fromItemsState.ITEM_CREATION_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.SavingFailed));
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during adding item" }));
                                return of(new SetUserDefinedPropertyAction(fromItemsState.ITEM_CREATION_FORMID,
                                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.SavingFailed));
                            }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));

    resetItemCreationForm$ = createEffect(() => this.actions$.pipe(ofType(resetItemCreationForm),
        switchMap(() => {
            return of(new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.project', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.tracker', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.subject', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.description', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.user', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.issue', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.cr', ''),
                new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.tms', ''),
                new ResetAction(fromItemsState.ITEM_CREATION_FORMID));
        })
    ));

    getItemById$ = createEffect(() => this.actions$.pipe(
        ofType(findItemById),
        switchMap((action: { id: string }) => {
            let params = new HttpParams();
            params = params.append("id", action.id);
            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

            return this.http.get<Item>(environment.apiUrl + '/softdev/items/get-item-by-id', { params, context }).pipe(mergeMap(item => {
                return of(new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.subject', item.item_summary),
                    new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.description', item.item_description),
                    new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.issue', item.issue_id),
                    new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.cr', item.cr_id),
                    new SetValueAction(fromItemsState.ITEM_CREATION_FORMID + '.tms', item.tms_id))
            }), catchError(error => {
                console.log(error);
                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting" }));
                return of(noopAction());
            }))
        })
    ));

}