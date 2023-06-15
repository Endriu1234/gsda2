import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromItemsState from '../items.state';
import * as fromSharedState from '../../../shared/store/shared.state';
import { Store } from '@ngrx/store';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import { SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { getBatchItemCreationSDCriteriaSearchFormState } from '../items.selectors';
import { environment } from 'src/environments/environment';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { BatchItemSearchHttpResponse } from '../models/batchitemcreation/batch-item-search-http-response.model';
import { setBatchItemCreationRecords, setRedmineProjectsFilterForBatchItemCreationSdCriteria, setSoftDevProjectsFilterForBatchItemCreationSdCriteria } from '../actions/items.batch-item-creation-actions';
import { noopAction } from '../actions/items.common-actions';

@Injectable()
export class ItemsBatchItemCreationEffects {
    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient) { }

    batchItemCreationSDCriteriaFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineProjectsFilterForBatchItemCreationSdCriteria())
            }
            if (action.controlId === fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.sourceSoftDevProject') {
                return of(setSoftDevProjectsFilterForBatchItemCreationSdCriteria())
            }
            //return from(validateProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilterForItemCreation())));

            return of(noopAction());
        })
    ));

    batchItemCreationSDCriteriaSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {

            if (action.controlId == fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID) {
                if (action.name == fromSharedState.FORM_SEARCH_STATE) {
                    if (action.value == fromSharedState.FormSearchState.Searching) {

                        return this.store.select(getBatchItemCreationSDCriteriaSearchFormState).pipe(take(1), switchMap(formData => {
                            let params = new HttpParams();
                            params = params.append("sourceSoftDevProject", formData.value.sourceSoftDevProject);
                            params = params.append("targetRedmineProject", formData.value.targetRedmineProject);
                            params = params.append("itemLevel", formData.value.itemLevel);
                            params = params.append("showCreated", formData.value.showCreated);

                            return this.http.get<BatchItemSearchHttpResponse>(environment.apiUrl + '/softdev/items/get-potential-redmine-items-from-sdproject',
                                { params })
                                .pipe(switchMap(response => {
                                    if (response.success) {

                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: 'Item saved' }));
                                        return of(setBatchItemCreationRecords({ proposedItems: response.records }),
                                            new SetUserDefinedPropertyAction(fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID,
                                                fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchSuccessful));
                                    }
                                    else {
                                        console.log(response.errorMessage);
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage }));
                                        return of(new SetUserDefinedPropertyAction(fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID,
                                            fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                    }
                                }), catchError(error => {
                                    console.log(error);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during Batch Item Creation SD Criteria Search" }));
                                    return of(new SetUserDefinedPropertyAction(fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID,
                                        fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                }))
                        }))
                    }
                }
            }

            return of(noopAction());
        })
    ));
}