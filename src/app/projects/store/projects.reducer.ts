import { createReducer, on } from '@ngrx/store';
import { initRedmineProjects, loadRedmineProjects, setRedmineProjectsFilter, initSoftDevProjects, loadSoftDevProjects, setSoftDevProjectsFilter } from './projects.actions';
import { initialState, ProjectCreationFromData, State } from './projects.state';
import * as fromReducerHanders from './projects.reducer-handlers';
import { onNgrxForms, updateGroup, validate, wrapReducerWithFormStateUpdate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

export const projectsReducerKey = 'projects';

const validationReducer = updateGroup<ProjectCreationFromData>({
    name: validate(required),
    identifier: validate(required)
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(initRedmineProjects, fromReducerHanders.initRedmineProjects),
    on(loadRedmineProjects, fromReducerHanders.loadRedmineProjects),
    on(setRedmineProjectsFilter, fromReducerHanders.setRedmineProjectsFilter),
    on(initSoftDevProjects, fromReducerHanders.initSoftDevProjects),
    on(loadSoftDevProjects, fromReducerHanders.loadSoftDevProjects),
    on(setSoftDevProjectsFilter, fromReducerHanders.setSoftDevProjectsFilter));


export const projectsReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.projectCreationFromData;
    },
    validationReducer
);