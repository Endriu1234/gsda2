import { createReducer, on } from "@ngrx/store";
import { initialState, State } from "./state/other.state";
import { onNgrxForms, updateGroup, validate, wrapReducerWithFormStateUpdate } from "ngrx-forms";
import { SoftDevQueriesCriteriaFormData } from "./state/sd-queries-state";
import { required } from "ngrx-forms/validation";
import { setSDOtherQueriesRecords } from "./actions/other.sd-queries-actions";
import * as fromOtherSDQueriesReducerHanders from './reducer-handlers/other.sd-queries-reducer-handlers';

export const otherReducerKey = 'other';

const validationReducer = updateGroup<SoftDevQueriesCriteriaFormData>({
    sdQuery: validate(required)
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(setSDOtherQueriesRecords, fromOtherSDQueriesReducerHanders.setSDOtherQueriesRecords)
);

export const otherReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.softDevQueriesCriteriaFormData;
    },
    validationReducer
);