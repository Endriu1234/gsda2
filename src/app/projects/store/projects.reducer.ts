import { createReducer, on } from '@ngrx/store';
import { initRedmineProjects, loadRedmineProjects, setRedmineProjectsFilter, initSoftDevProjects, loadSoftDevProjects, setSoftDevProjectsFilter } from './projects.actions';
import { initialState } from './projects.state';
import * as fromReducerHanders from './projects.reducer-handlers';

export const projectsReducerKey = 'projects';

export const projectsReducer = createReducer(initialState,
    on(initRedmineProjects, fromReducerHanders.initRedmineProjects),
    on(loadRedmineProjects, fromReducerHanders.loadRedmineProjects),
    on(setRedmineProjectsFilter, fromReducerHanders.setRedmineProjectsFilter),
    on(initSoftDevProjects, fromReducerHanders.initSoftDevProjects),
    on(loadSoftDevProjects, fromReducerHanders.loadSoftDevProjects),
    on(setSoftDevProjectsFilter, fromReducerHanders.setSoftDevProjectsFilter));
