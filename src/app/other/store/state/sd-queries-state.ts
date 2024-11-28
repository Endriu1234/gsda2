import { createFormGroupState, FormGroupState } from "ngrx-forms";

export const SOFT_DEV_QUERIES_FORMID = "SOFT_DEV_QUERIES_FORMID";

export interface SoftDevQueriesCriteriaFormData {
    sdQuery: string
};

export function getSoftDevQueriesCriteriaFormDataInitialState(): FormGroupState<SoftDevQueriesCriteriaFormData> {
    return createFormGroupState<SoftDevQueriesCriteriaFormData>(SOFT_DEV_QUERIES_FORMID, {
        sdQuery: ''
    });
}

export interface SoftDevQueriesRecords {
    rows: any[];
    columns: any[];
}

export function getSoftDevQueriesRecordsInitialState(): SoftDevQueriesRecords {
    return {
        rows: [],
        columns: []
    }
}