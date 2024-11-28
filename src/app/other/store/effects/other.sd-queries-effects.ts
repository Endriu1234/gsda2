import { SetUserDefinedPropertyAction } from 'ngrx-forms';
import * as fromSharedState from '../../../shared/store/shared.state';
import { SOFT_DEV_QUERIES_FORMID } from "../state/sd-queries-state";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import * as fromItemsState from '../state/other.state';
import { ProgressBarSpinnerService } from 'src/app/shared/spinner/progress-bar/progress-bar-spinner/progress-bar-spinner.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { addSnackbarNotification, noopAction } from 'src/app/shared/store/shared.actions';
import { getOtherSDQueriesCriteriaFormState } from '../selectors/other.sd-queries-selectors';
import { SpinnerType, TYPE_OF_SPINNER } from 'src/app/shared/tools/interceptors/http-context-params';
import { environment } from 'src/environments/environment';
import { SnackBarIcon } from '../../../shared/store/shared.state';
import { SDQueriesSearchHttpResponse } from '../models/sdQuery/sd-queries.model';
import { setSDOtherQueriesRecords } from '../actions/other.sd-queries-actions';



@Injectable()
export class OtherSDQueriesEffects {
    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient,
        private router: Router,
        private progressBarService: ProgressBarSpinnerService) { }


    batchItemCreationSDCriteriaSetUserDefinedValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetUserDefinedPropertyAction.TYPE),
        switchMap((action: SetUserDefinedPropertyAction) => {
            if (action.controlId == SOFT_DEV_QUERIES_FORMID) {
                if (action.name == fromSharedState.FORM_SEARCH_STATE) {
                    if (action.value == fromSharedState.FormSearchState.Searching) {
                        return this.store.select(getOtherSDQueriesCriteriaFormState).pipe(take(1), switchMap(formData => {
                            let params = new HttpParams();
                            params = params.append("sdQuery", formData.value.sdQuery);
                            let context = new HttpContext().set(TYPE_OF_SPINNER, SpinnerType.FullScreen);
                            return this.http.get<SDQueriesSearchHttpResponse>(environment.apiUrl + '/softdev/other/get-data-from-queries',
                                { params, context })
                                .pipe(switchMap(response => {
                                    if (response.success) {

                                        return of(setSDOtherQueriesRecords({ rows: response.records, columns: response.columns }),
                                            new SetUserDefinedPropertyAction(SOFT_DEV_QUERIES_FORMID,
                                                fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchSuccessful));
                                    }
                                    else {
                                        console.log(response.errorMessage);
                                        this.sharedStore.dispatch(addSnackbarNotification({ notification: response.errorMessage, icon: SnackBarIcon.Error }));
                                        return of(new SetUserDefinedPropertyAction(SOFT_DEV_QUERIES_FORMID,
                                            fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                    }
                                }), catchError(error => {
                                    console.log(error);
                                    this.sharedStore.dispatch(addSnackbarNotification({ notification: "Error during executing Query!", icon: SnackBarIcon.Error }));
                                    return of(new SetUserDefinedPropertyAction(SOFT_DEV_QUERIES_FORMID,
                                        fromSharedState.FORM_SEARCH_STATE, fromSharedState.FormSearchState.SearchFailed));
                                }))
                        }))
                    }
                }
            }
            return of(noopAction());
        })));
}