import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromItemsState from './items.state';
import * as fromSharedState from '../../shared/store/shared.state';
import { Store } from '@ngrx/store';
import { catchError, from, map, mergeMap, of, startWith, switchMap, take } from "rxjs";
import { ResetAction, SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { noopAction, setRedmineProjectsFilterForBatchItemCreationSdCriteria } from './items.actions';

@Injectable()
export class ItemsBatchItemCreationEffects {
    constructor(private actions$: Actions,
        private store: Store<fromItemsState.State>,
        private sharedStore: Store<fromSharedState.State>,
        private http: HttpClient) { }

    batchItemCreationFormSetValue$ = createEffect(() => this.actions$.pipe(
        ofType(SetValueAction.TYPE),
        switchMap((action: SetValueAction<any>) => {
            if (action.controlId === fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID + '.targetRedmineProject') {
                return of(setRedmineProjectsFilterForBatchItemCreationSdCriteria())
            }
            //return from(validateProject(this.store, validateProjectError, action.controlId, action.value).pipe(startWith(setRedmineProjectsFilterForItemCreation())));

            return of(noopAction());
        })
    ));
}