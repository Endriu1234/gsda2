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
import { endResetItemCreationForm, fillItemById, identifyAndFillItemById, setRedmineProjectsFilterForItemCreation, setRedmineUsersByLetterFilter, startResetItemCreationForm } from '../actions/items.item-creation-actions';
import { noopAction } from '../actions/items.common-actions';
import { getItemCreationDialogState, getItemCreationFormState, getItemCreationFormWithSetup } from '../selectors/items.item-creation-selectors';
import { ITEM_CREATION_DIALOG, ITEM_CREATION_FORMID, ItemCreationMode } from '../state/items.item-creation-state';
import { SnackBarIcon } from '../../../shared/store/shared.state';
import { continueBatchItemsCreation, forceEndBatchItemCreation, setLinkToCurrentProposedItemAndUnselect } from '../actions/items.batch-item-creation-actions';



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

                        return this.store.select(getItemCreationFormWithSetup).pipe(take(1), switchMap(formData => {
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.post<GsdaRedmineHttpResponse>(environment.apiUrl + '/redmine/items/create-redmine-item', formData.creationFormState.value, { context }).pipe(switchMap(response => {
                                if (response.success) {

                                    if (formData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {

                                        if (action.value == fromSharedState.FormSaveState.SavingWithRedirect && response.redmineLink) {

                                            window.location.href = response.redmineLink;
                                        }

                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved', icon: SnackBarIcon.Success }));

                                        return of(startResetItemCreationForm());
                                    }
                                    else if (formData.creationFormSetupState.mode === ItemCreationMode.BatchItemWithGUI
                                        || formData.creationFormSetupState.mode === ItemCreationMode.BatchItemWithoutGUI) {

                                        if (formData.creationFormSetupState.mode === ItemCreationMode.BatchItemWithGUI)
                                            this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved', icon: SnackBarIcon.Success }));

                                        return of(setLinkToCurrentProposedItemAndUnselect({ redmineLink: response.redmineLink }), continueBatchItemsCreation());
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

                                    return of(forceEndBatchItemCreation());
                                }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during adding item", icon: SnackBarIcon.Error }));

                                if (formData.creationFormSetupState.mode === ItemCreationMode.SingleItem) {
                                    return of(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID,
                                        fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New));
                                }

                                return of(forceEndBatchItemCreation());
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
                new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID,
                    fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.New),
                new ResetAction(ITEM_CREATION_FORMID), endResetItemCreationForm());
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
                        new SetValueAction(ITEM_CREATION_FORMID + '.tms', item.tms_id))
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
                        new SetValueAction(ITEM_CREATION_FORMID + '.tms', item.tms_id))
                }))
            }), catchError(error => {
                console.log(error);
                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Something went wrong during defaulting", icon: SnackBarIcon.Error }));
                return of(noopAction());
            }))
        })
    ));

}
