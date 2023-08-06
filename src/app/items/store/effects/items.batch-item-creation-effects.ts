import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromItemsState from '../state/items.state';
import * as fromSharedState from '../../../shared/store/shared.state';
import { Store } from '@ngrx/store';
import { catchError, from, of, startWith, switchMap, take } from "rxjs";
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction, validate } from 'ngrx-forms';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { environment } from 'src/environments/environment';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { BatchItemSearchHttpResponse } from '../models/batchitemcreation/batch-item-search-http-response.model';
import { continueBatchItemsCreation, createOneRecordFromBatch, forceEndBatchItemCreation, setBatchItemCreationRecords, setRedmineProjectsFilterForBatchItemCreationSdCriteria, setSoftDevProjectsFilterForBatchItemCreationSdCriteria, startBatchItemsCreation } from '../actions/items.batch-item-creation-actions';
import { noopAction } from '../actions/items.common-actions';
import { getBatchItemCreationFormData, getBatchItemCreationRecords, getBatchItemCreationSDCriteriaSearchFormState, getBatchItemsRecordsWithFormData } from '../selectors/items.batch-item-creation-selectors';
import { BATCH_ITEM_CREATION_SDCRITERIA_FORMID } from '../state/items.batch-item-creation-state';
import { SnackBarIcon } from '../../../shared/store/shared.state';
import { Router } from '@angular/router';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';
import { setItemCreationFormMode, startResetItemCreationForm } from '../actions/items.item-creation-actions';
import { ITEM_CREATION_FORMID, ItemCreationMode } from '../state/items.item-creation-state';
import { validateRedmineProject, validateSDProject } from '../batch-items.validation';
import { required } from 'ngrx-forms/validation';

export const validateSDTargetRedmineProjectError = "validateSDTargetRedmineProjectError";
export const validateSDSourceSoftDevProjectError = "validateSDSourceSoftDevProjectError";
export const validateItemLevelError = "validateItemLevelError";

@Injectable()
export class ItemsBatchItemCreationEffects {
    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient,
        private router: Router) { }

    batchItemCreationSDCriteriaFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineProjectsFilterForBatchItemCreationSdCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.sourceSoftDevProject') {
                return of(setSoftDevProjectsFilterForBatchItemCreationSdCriteria())
            }

            return of(noopAction());
        })
    ));

    batchItemCreationSDCriteriaSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == BATCH_ITEM_CREATION_SDCRITERIA_FORMID) {
                if (action.name == fromSharedState.FORM_SEARCH_STATE) {
                    if (action.value == fromSharedState.FormSearchState.Searching) {

                        return this.store.select(getBatchItemCreationSDCriteriaSearchFormState).pipe(take(1), switchMap(formData => {
                            let params = new HttpParams();
                            params = params.append("sourceSoftDevProject", formData.value.sourceSoftDevProject);
                            params = params.append("targetRedmineProject", formData.value.targetRedmineProject);
                            params = params.append("itemLevel", formData.value.itemLevel);
                            params = params.append("showCreated", formData.value.showCreated);
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                            return this.http.get<BatchItemSearchHttpResponse>(environment.apiUrl + '/softdev/items/get-potential-redmine-items-from-sdproject',
                                { params, context })
                                .pipe(switchMap(response => {
                                    if (response.success) {

                                        return of(setBatchItemCreationRecords({ proposedItems: response.records }),
                                            new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_SDCRITERIA_FORMID,
                                                fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchSuccessful));
                                    }
                                    else {
                                        console.log(response.errorMessage);
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                        return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_SDCRITERIA_FORMID,
                                            fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                    }
                                }), catchError(error => {
                                    console.log(error);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during Batch Item Creation SD Criteria Search", icon: SnackBarIcon.Error }));
                                    return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_SDCRITERIA_FORMID,
                                        fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));

    startBatchItemsCreation$ = createEffect(() => this.actions$.pipe(
        ofType(startBatchItemsCreation),
        switchMap(() => {

            return this.store.select(getBatchItemsRecordsWithFormData).pipe(take(1), switchMap(batchRecordsWithFormData => {

                let currentItem = batchRecordsWithFormData.batchRecords.proposedItems[batchRecordsWithFormData.batchRecords.currentIndex];

                const actions: any[] = [
                    new ResetAction(ITEM_CREATION_FORMID),
                    new SetValueAction(ITEM_CREATION_FORMID + '.project', currentItem.REDMINE_PROJECT),
                    new SetValueAction(ITEM_CREATION_FORMID + '.tracker', currentItem.TRACKER),
                    new SetValueAction(ITEM_CREATION_FORMID + '.subject', currentItem.SUBJECT),
                    new SetValueAction(ITEM_CREATION_FORMID + '.description', currentItem.DESCRIPTION),
                    new SetValueAction(ITEM_CREATION_FORMID + '.user', currentItem.ASSIGNEE),
                    new SetValueAction(ITEM_CREATION_FORMID + '.issue', currentItem.ISSUE),
                    new SetValueAction(ITEM_CREATION_FORMID + '.cr', currentItem.CR),
                    new SetValueAction(ITEM_CREATION_FORMID + '.tms', currentItem.TMS)
                ];

                if (batchRecordsWithFormData.batchFormData.value.skipCreationForm) {
                    actions.push(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.Saving));
                    return actions;
                }
                else {
                    this.router.navigate(['/items/itemcreation']);
                    return actions;
                }
            }));
        })
    ));

    continueBatchItemsCreation$ = createEffect(() => this.actions$.pipe(
        ofType(continueBatchItemsCreation),
        switchMap(() => {

            return this.store.select(getBatchItemsRecordsWithFormData).pipe(take(1), switchMap(batchRecordsWithFormData => {

                if (batchRecordsWithFormData.batchRecords.currentIndex < 0) {
                    this.router.navigate(['/items/batchitemscreation']);

                    return of(startResetItemCreationForm());
                }

                let currentItem = batchRecordsWithFormData.batchRecords.proposedItems[batchRecordsWithFormData.batchRecords.currentIndex];

                const actions: any[] = [
                    new ResetAction(ITEM_CREATION_FORMID),
                    new SetValueAction(ITEM_CREATION_FORMID + '.project', currentItem.REDMINE_PROJECT),
                    new SetValueAction(ITEM_CREATION_FORMID + '.tracker', currentItem.TRACKER),
                    new SetValueAction(ITEM_CREATION_FORMID + '.subject', currentItem.SUBJECT),
                    new SetValueAction(ITEM_CREATION_FORMID + '.description', currentItem.DESCRIPTION),
                    new SetValueAction(ITEM_CREATION_FORMID + '.user', currentItem.ASSIGNEE),
                    new SetValueAction(ITEM_CREATION_FORMID + '.issue', currentItem.ISSUE),
                    new SetValueAction(ITEM_CREATION_FORMID + '.cr', currentItem.CR),
                    new SetValueAction(ITEM_CREATION_FORMID + '.tms', currentItem.TMS)
                ];

                if (batchRecordsWithFormData.batchFormData.value.skipCreationForm)
                    actions.push(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.Saving));

                return actions;
            }));
        })
    ));

    forceEndBatchItemCreation$ = createEffect(() => this.actions$.pipe(
        ofType(forceEndBatchItemCreation),
        switchMap(() => {

            return this.store.select(getBatchItemCreationRecords).pipe(take(1), switchMap(batchRecords => {

                this.router.navigate(['/items/batchitemscreation']);
                return of(startResetItemCreationForm());
            }));
        })
    ));


    
    batchItemSDCriteriaFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.sourceSoftDevProject')
                return from(validateSDProject(this.store, validateSDSourceSoftDevProjectError, action.controlId, action.value).pipe(startWith(setSoftDevProjectsFilterForBatchItemCreationSdCriteria())));

            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.targetRedmineProject')
                return from(validateRedmineProject(this.store, validateSDTargetRedmineProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilterForBatchItemCreationSdCriteria())));
            
            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.itemLevel')
                return of(validate(required));

            return of(noopAction());
        })
    ));

    createOneRecordFromBatch$ = createEffect(() => this.actions$.pipe(
        ofType(createOneRecordFromBatch),
        switchMap((element: {proposedItem: ProposedItem}) => {
            return this.store.select(getBatchItemCreationFormData).pipe(take(1), switchMap(batchItemCreationFormData => {
                const actions: any[] = [
                    new ResetAction(ITEM_CREATION_FORMID),
                    new SetValueAction(ITEM_CREATION_FORMID + '.project', element.proposedItem.REDMINE_PROJECT),
                    new SetValueAction(ITEM_CREATION_FORMID + '.tracker', element.proposedItem.TRACKER),
                    new SetValueAction(ITEM_CREATION_FORMID + '.subject', element.proposedItem.SUBJECT),
                    new SetValueAction(ITEM_CREATION_FORMID + '.description', element.proposedItem.DESCRIPTION),
                    new SetValueAction(ITEM_CREATION_FORMID + '.user', element.proposedItem.ASSIGNEE),
                    new SetValueAction(ITEM_CREATION_FORMID + '.issue', element.proposedItem.ISSUE),
                    new SetValueAction(ITEM_CREATION_FORMID + '.cr', element.proposedItem.CR),
                    new SetValueAction(ITEM_CREATION_FORMID + '.tms', element.proposedItem.TMS)
                ];

                if (batchItemCreationFormData.value.skipCreationForm) {
                    actions.push(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, fromSharedState.FORM_SAVE_STATE, fromSharedState.FormSaveState.Saving));
                    return actions;
                }
                else {
                    this.router.navigate(['/items/itemcreation']);
                    return actions;
                }
            }));
        })
    ));
}