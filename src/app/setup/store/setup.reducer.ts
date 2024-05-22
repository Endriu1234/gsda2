import { createReducer, on } from "@ngrx/store";
import { State, initialState } from "./state/setup.state";
import { onNgrxForms, updateGroup, wrapReducerWithFormStateUpdate } from "ngrx-forms";
import { CacheRefreshFromData } from "./state/setup.cache-refresh-state";
import * as setupReducerHanders from './reducer-handlers/setup.reducer.handlers';
import { endRefreshCache, endRefreshCustomFields, endRefreshEmailSettings, endRefreshRedmineProjects, endRefreshSDProjects, endRefreshUserPreferences, endRefreshVersions, refreshCache, refreshCustomFields, refreshEmailSettings, refreshRedmineProjects, refreshSDProjects, refreshUserPreferences, refreshVersions } from "./actions/setup.actions";

export const setupReducerKey = 'setup';

const validationReducer = updateGroup<CacheRefreshFromData>({
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(refreshCache, setupReducerHanders.refreshCache),
    on(endRefreshCache, setupReducerHanders.endRefreshCache),
    on(refreshVersions, setupReducerHanders.refreshVersions),
    on(endRefreshVersions, setupReducerHanders.endRefreshVersions),
    on(refreshSDProjects, setupReducerHanders.refreshSDProjects),
    on(endRefreshSDProjects, setupReducerHanders.endRefreshSDProjects),
    on(refreshRedmineProjects, setupReducerHanders.refreshRedmineProjects),
    on(endRefreshRedmineProjects, setupReducerHanders.endRefreshRedmineProjects),
    on(refreshCustomFields, setupReducerHanders.refreshCustomFields),
    on(endRefreshCustomFields, setupReducerHanders.endRefreshCustomFields),
    on(refreshEmailSettings, setupReducerHanders.refreshEmailSettings),
    on(endRefreshEmailSettings, setupReducerHanders.endRefreshEmailSettings),
    on(refreshUserPreferences, setupReducerHanders.refreshUserPreferences),
    on(endRefreshUserPreferences, setupReducerHanders.endRefreshUserPreferences)
);

export const setupReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.cacheRefreshFormData;
    },
    validationReducer
);