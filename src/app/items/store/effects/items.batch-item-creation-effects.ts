import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromItemsState from '../state/items.state';
import * as fromSharedState from '../../../shared/store/shared.state';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, startWith, switchMap, take } from "rxjs";
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';
import { environment } from 'src/environments/environment';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { BatchItemSearchHttpResponse } from '../models/batchitemcreation/batch-item-search-http-response.model';
import { continueBatchItemsCreation, createOneRecordFromBatch, forceEndBatchItemCreation, initRedmineVersionsForIds, initRedmineVersionsForRedmine, initRedmineVersionsForSd, initRedmineVersionsForTms, initTmsClients, loadRedmineVersionsForIds, loadRedmineVersionsForRedmine, loadRedmineVersionsForSd, loadRedmineVersionsForTms, loadTmsClients, setBatchItemCreationRecords, setRedmineProjectsFilterForBatchItemCreationSdCriteria, setRedmineSourceProjectsFilterForBatchItemCreationCriteria as setRedmineSourceProjectsFilterForBatchItemCreationCriteria, setRedmineTargetProjectsFilterForBatchItemCreationCriteria, setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria, setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria, setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria, setSoftDevProjectsFilterForBatchItemCreationSdCriteria, setTmsClientsByLetterFilter, startBatchItemsCreation, updateBatchItemCreationFormColumn } from '../actions/items.batch-item-creation-actions';
import { noopAction } from '../actions/items.common-actions';
import { getBatchItemCreationFormData, getBatchItemCreationIdsCriteriaFormState, getBatchItemCreationRecords, getBatchItemCreationRedmineCriteriaFormState, getBatchItemCreationSDCriteriaSearchFormState, getBatchItemCreationTMSCriteriaFormState, getBatchItemsRecordsWithFormData } from '../selectors/items.batch-item-creation-selectors';
import { BATCH_ITEM_CREATION_FORMID, BATCH_ITEM_CREATION_IDSCRITERIA_FORMID, BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID, BATCH_ITEM_CREATION_SDCRITERIA_FORMID, BATCH_ITEM_CREATION_TMSCRITERIA_FORMID } from '../state/items.batch-item-creation-state';
import { SnackBarIcon } from '../../../shared/store/shared.state';
import { Router } from '@angular/router';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';
import { startResetItemCreationForm } from '../actions/items.item-creation-actions';
import { ITEM_CREATION_FORMID } from '../state/items.item-creation-state';
import { validateIds, validateRedmineProject, validateSDProject, validateTms, validateUserForTms } from '../batch-items.validation';
import { TmsClient } from 'src/app/shared/store/models/tms-client.model';
import { ProgressBarSpinnerService } from 'src/app/shared/spinner/progress-bar/progress-bar-spinner/progress-bar-spinner.service';
import { RedmineVersion } from '../models/redmine-version.model';

export const validateSDTargetRedmineProjectError = "validateSDTargetRedmineProjectError";
export const validateSDSourceSoftDevProjectError = "validateSDSourceSoftDevProjectError";
export const validateRmTargetRedmineProjectError = "validateRmTargetRedmineProjectError";
export const validateRmSourceRedmineProjectError = "validateRmSourceRedmineProjectError";
export const validateTmsTargetRedmineProjectError = "validateTmsTargetRedmineProjectError";
export const validateSourceTmsError = "validateSourceTmsError";
export const validateItemLevelError = "validateItemLevelError";
export const validateTmsUserError = "validateTmsUserError";
export const validateIdsTargetRedmineProjectError = "validateIdsTargetRedmineProjectError";
export const validateIdsError = "validateIdsError";

@Injectable()
export class ItemsBatchItemCreationEffects {
    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient,
        private router: Router,
        private progressBarService: ProgressBarSpinnerService) { }

    batchItemCreationSDCriteriaFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineProjectsFilterForBatchItemCreationSdCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.sourceSoftDevProject') {
                return of(setSoftDevProjectsFilterForBatchItemCreationSdCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID + '.sourceRedmineProject') {
                return of(setRedmineSourceProjectsFilterForBatchItemCreationCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineTargetProjectsFilterForBatchItemCreationCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_TMSCRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_TMSCRITERIA_FORMID + '.userToITms') {
                return of(setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria())
            }
            if (action.controlId === BATCH_ITEM_CREATION_TMSCRITERIA_FORMID + '.iTMSClient') {
                return of(setTmsClientsByLetterFilter())
            }
            if (action.controlId === BATCH_ITEM_CREATION_IDSCRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria())
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
                            params = params.append("redmine_version", formData.value.version);
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
            if (action.controlId == BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID) {
                if (action.name == fromSharedState.FORM_SEARCH_STATE) {
                    if (action.value == fromSharedState.FormSearchState.Searching) {
                        return this.store.select(getBatchItemCreationRedmineCriteriaFormState).pipe(take(1), switchMap(formData => {
                            let params = new HttpParams();
                            params = params.append("sourceRedmineProject", formData.value.sourceRedmineProject);
                            params = params.append("targetRedmineProject", formData.value.targetRedmineProject);
                            params = params.append("showClosed", formData.value.showClosed);
                            params = params.append("showCreated", formData.value.showCreated);
                            params = params.append("redmine_version", formData.value.version);
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);

                            return this.http.get<BatchItemSearchHttpResponse>(environment.apiUrl + '/redmine/items/get-potential-redmine-items-from-rmproject',
                                { params, context })
                                .pipe(switchMap(response => {
                                    if (response.success) {

                                        return of(setBatchItemCreationRecords({ proposedItems: response.records }),
                                            new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID,
                                                fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchSuccessful));
                                    }
                                    else {
                                        console.log(response.errorMessage);
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                        return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID,
                                            fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                    }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during Batch Item Creation Redmine Criteria Search", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID,
                                    fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                            }))
                        }))
                    }
                }
            }
            if (action.controlId == BATCH_ITEM_CREATION_TMSCRITERIA_FORMID) {
                if (action.name == fromSharedState.FORM_SEARCH_STATE) {
                    if (action.value == fromSharedState.FormSearchState.Searching) {
                        return this.store.select(getBatchItemCreationTMSCriteriaFormState).pipe(take(1), switchMap(formData => {
                            let params = new HttpParams();
                            params = params.append("iTMSClient", formData.value.iTMSClient);
                            params = params.append("targetRedmineProject", formData.value.targetRedmineProject);
                            params = params.append("showClosed", formData.value.showClosed);
                            params = params.append("showCreated", formData.value.showCreated);
                            params = params.append("showInClientBin", formData.value.showInClientBin);
                            params = params.append("fromDate", formData.value.fromDate);
                            params = params.append("toDate", formData.value.toDate);
                            params = params.append("userToiTMS", formData.value.userToITms);
                            params = params.append("redmine_version", formData.value.version);
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            
                            return this.http.get<BatchItemSearchHttpResponse>(environment.apiUrl + '/softdev/tms/get-potential-redmine-items-from-tms',
                                { params, context })
                                .pipe(switchMap(response => {
                                    if (response.success) {

                                        return of(setBatchItemCreationRecords({ proposedItems: response.records }),
                                            new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_TMSCRITERIA_FORMID,
                                                fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchSuccessful));
                                    }
                                    else {
                                        console.log(response.errorMessage);
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                        return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_TMSCRITERIA_FORMID,
                                            fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                    }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during Batch Item Creation iTMS Criteria Search", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_TMSCRITERIA_FORMID,
                                    fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                            }))
                        }))
                    }
                }
            }
            if (action.controlId === BATCH_ITEM_CREATION_IDSCRITERIA_FORMID) {
                if (action.name == fromSharedState.FORM_SEARCH_STATE) {
                    if (action.value == fromSharedState.FormSearchState.Searching) {
                        return this.store.select(getBatchItemCreationIdsCriteriaFormState).pipe(take(1), switchMap(formData => {
                            let params = new HttpParams();
                            params = params.append("AllIds", formData.value.allIds);
                            params = params.append("targetRedmineProject", formData.value.targetRedmineProject);
                            params = params.append("showCreated", formData.value.showCreated);
                            params = params.append("redmine_version", formData.value.version);
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            
                            return this.http.get<BatchItemSearchHttpResponse>(environment.apiUrl + '/softdev/items/get-potential-redmine-items-from-ids',
                                { params, context })
                                .pipe(switchMap(response => {
                                    if (response.success) {

                                        return of(setBatchItemCreationRecords({ proposedItems: response.records }),
                                            new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_IDSCRITERIA_FORMID,
                                                fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchSuccessful));
                                    }
                                    else {
                                        console.log(response.errorMessage);
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                        return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_IDSCRITERIA_FORMID,
                                            fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                    }
                            }), catchError(error => {
                                console.log(error);
                                this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during Batch Item Creation Ids Criteria Search", icon: SnackBarIcon.Error }));
                                return of(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_IDSCRITERIA_FORMID,
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
                    new SetValueAction(ITEM_CREATION_FORMID + '.tms', currentItem.TMS),
                    new SetValueAction(ITEM_CREATION_FORMID + '.version', currentItem.REDMINE_VERSION),
                    new SetValueAction(ITEM_CREATION_FORMID + '.est_time', currentItem.CR_EST_HOURS)
                ];

                this.progressBarService.startProgress(batchRecordsWithFormData.batchRecords.proposedItems.filter((item) => item.SELECTED == true).length, batchRecordsWithFormData.batchFormData.value.skipCreationForm);
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

                if (batchRecordsWithFormData.batchRecords.currentIndex < 0 || this.progressBarService.checkIsCanceled()) {
                    this.progressBarService.stopProgress();
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
                    new SetValueAction(ITEM_CREATION_FORMID + '.tms', currentItem.TMS),
                    new SetValueAction(ITEM_CREATION_FORMID + '.version', currentItem.REDMINE_VERSION),
                    new SetValueAction(ITEM_CREATION_FORMID + '.est_time', currentItem.CR_EST_HOURS)
                ];

                this.progressBarService.nextElement();
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

                this.progressBarService.resetProgress();
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
            
            if (action.controlId === BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID + '.sourceRedmineProject')
                return from(validateRedmineProject(this.store, validateRmSourceRedmineProjectError, action.controlId, action.value).pipe(startWith(setRedmineSourceProjectsFilterForBatchItemCreationCriteria())));

            if (action.controlId === BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID + '.targetRedmineProject')
                return from(validateRedmineProject(this.store, validateRmTargetRedmineProjectError, action.controlId, action.value).pipe(startWith(setRedmineTargetProjectsFilterForBatchItemCreationCriteria())));

            if (action.controlId === BATCH_ITEM_CREATION_TMSCRITERIA_FORMID + '.targetRedmineProject')
                return from(validateRedmineProject(this.store, validateTmsTargetRedmineProjectError, action.controlId, action.value).pipe(startWith(setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria())));

            if (action.controlId === BATCH_ITEM_CREATION_TMSCRITERIA_FORMID + '.iTMSClient')
                return from(validateTms(this.store, validateSourceTmsError, action.controlId, action.value).pipe(startWith(setTmsClientsByLetterFilter())));

            if (action.controlId === BATCH_ITEM_CREATION_TMSCRITERIA_FORMID + '.userToITms') {
                return from(validateUserForTms(this.store, validateTmsUserError, action.controlId, action.value).pipe(startWith(setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria())));
            }

            if (action.controlId === BATCH_ITEM_CREATION_IDSCRITERIA_FORMID + '.targetRedmineProject') {
                return from(validateRedmineProject(this.store, validateIdsTargetRedmineProjectError, action.controlId, action.value).pipe(startWith(setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria())));
            }

            if (action.controlId === BATCH_ITEM_CREATION_IDSCRITERIA_FORMID + '.allIds') {
                return from(validateIds(this.store, validateIdsError, action.controlId, action.value));
            }

            /*if (action.controlId === BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.itemLevel')
                return of(validate(required));*/

            if (action.controlId === BATCH_ITEM_CREATION_FORMID + '.visibleColumns')
                return of(updateBatchItemCreationFormColumn());

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
                    new SetValueAction(ITEM_CREATION_FORMID + '.tms', element.proposedItem.TMS),
                    new SetValueAction(ITEM_CREATION_FORMID + '.version', element.proposedItem.REDMINE_VERSION),
                    new SetValueAction(ITEM_CREATION_FORMID + '.est_time', element.proposedItem.CR_EST_HOURS)
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

    initTmsClients$ = createEffect(() => this.actions$.pipe(ofType(initTmsClients),
        switchMap(() => {
            return this.http.get<TmsClient[]>(environment.apiUrl + '/softdev/tms/get-tms-clients');
        }), map(tmsClients => loadTmsClients({ tmsClients }))
    ));

    initRedmineVersionsForIds$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersionsForIds),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersionsForIds({ redmineVersions }))
    ));

    initRedmineVersionsForTms$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersionsForTms),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersionsForTms({ redmineVersions }))
    ));

    initRedmineVersionsForRedmine$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersionsForRedmine),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersionsForRedmine({ redmineVersions }))
    ));

    initRedmineVersionsForSd$ = createEffect(() => this.actions$.pipe(ofType(initRedmineVersionsForSd),
        switchMap((param) => {
            let params = new HttpParams();
            params = params.append("redmineProject", param.projectName);
            return this.http.get<RedmineVersion[]>(environment.apiUrl + '/redmine/items/get-redmine-versions', { params });
        }), map(redmineVersions => loadRedmineVersionsForSd({ redmineVersions }))
    ));
}