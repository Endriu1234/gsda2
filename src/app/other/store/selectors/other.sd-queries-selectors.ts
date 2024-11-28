import { createFeatureSelector, createSelector } from "@ngrx/store";
import { otherReducerKey } from './../other.reducer';
import { State } from '../state/other.state';
import { FormGroupState } from "ngrx-forms";
import { SoftDevQueriesCriteriaFormData, SoftDevQueriesRecords } from "../state/sd-queries-state";

export const getOtherState = createFeatureSelector<State>(otherReducerKey);
export const getOtherSDQueriesCriteriaFormState = createSelector(getOtherState, (state: State) => state.softDevQueriesCriteriaFormData);
export const getOtherSDQueriesRecords = createSelector(getOtherState, (state: State) => state.softDevQueriesRecords);
export const getOtherSDQueriesRows = createSelector(getOtherState, (state: State) => state.softDevQueriesRecords.rows);
export const getOtherSDQueriesColumns = createSelector(getOtherState, (state: State) => {
    return state.softDevQueriesRecords.columns.map((column: any) => column.name);
});
export const getOtherSDQueriesCanActivateFind = createSelector(getOtherSDQueriesCriteriaFormState, canActivateFind);

function canActivateFind(formState: FormGroupState<SoftDevQueriesCriteriaFormData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid 
        || !formState.controls.sdQuery.value) {
        return false;
    }

    return true;
}

export const getOtherSDQueriesCanActivateGrid = createSelector(getOtherSDQueriesRecords, canOtherSDQueriesActivateGrid);

function canOtherSDQueriesActivateGrid(sdQueryRecords: SoftDevQueriesRecords): boolean {
    if (!sdQueryRecords.rows || sdQueryRecords.rows.length <= 0) {
        return false;
    }

    return true;
}