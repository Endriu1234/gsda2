import { FormGroupState } from "ngrx-forms";
import { getSoftDevQueriesCriteriaFormDataInitialState, getSoftDevQueriesRecordsInitialState, SoftDevQueriesCriteriaFormData, SoftDevQueriesRecords } from "./sd-queries-state";

export interface State {
    softDevQueriesCriteriaFormData: FormGroupState<SoftDevQueriesCriteriaFormData>;
    softDevQueriesRecords: SoftDevQueriesRecords;
}

export const initialState: State = {
    softDevQueriesCriteriaFormData: getSoftDevQueriesCriteriaFormDataInitialState(),
    softDevQueriesRecords: getSoftDevQueriesRecordsInitialState()
}