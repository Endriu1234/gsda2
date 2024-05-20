import { createReducer, on } from "@ngrx/store";
import { State, initialState } from "./state/setup.state";
import { onNgrxForms, updateGroup, wrapReducerWithFormStateUpdate } from "ngrx-forms";
import { CacheRefreshFromData } from "./state/setup.cache-refresh-state";
import * as setupReducerHanders from './reducer-handlers/setup.reducer.handlers';
import { endRefreshCache, refreshCache } from "./actions/setup.actions";

export const setupReducerKey = 'setup';

const validationReducer = updateGroup<CacheRefreshFromData>({
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(refreshCache, setupReducerHanders.refreshCache),
    on(endRefreshCache, setupReducerHanders.endRefreshCache)
);

export const setupReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.cacheRefreshFormData;
    },
    validationReducer
);