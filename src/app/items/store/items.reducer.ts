import { createReducer, on } from '@ngrx/store';
import { initRedmineTrackers, loadRedmineTrackers, initRedmineUsers, loadRedmineUsers, initRedmineProjects, loadRedmineProjects, setRedmineUsersFilter, setRedmineProjectsFilter } from './items.actions';
import { initialState } from './items.state';
import * as fromReducerHanders from './items.reducer-handlers';

export const itemsReducerKey = 'items';

export const itemsReducer = createReducer(initialState,
    on(initRedmineTrackers, fromReducerHanders.initRedmineTrackers),
    on(loadRedmineTrackers, fromReducerHanders.loadRedmineTrackers),
    on(initRedmineUsers, fromReducerHanders.initRedmineUsers),
    on(loadRedmineUsers, fromReducerHanders.loadRedmineUsers),
    on(initRedmineProjects, fromReducerHanders.initRedmineProjects),
    on(loadRedmineProjects, fromReducerHanders.loadRedmineProjects),
    on(setRedmineUsersFilter, fromReducerHanders.setRedmineUsersFilter),
    on(setRedmineProjectsFilter, fromReducerHanders.setRedmineProjectsFilter));
