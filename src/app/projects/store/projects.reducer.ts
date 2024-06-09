import { createReducer, on } from '@ngrx/store';
import { initRedmineProjects, loadRedmineProjects, setRedmineProjectsFilter, initSoftDevProjects, loadSoftDevProjects, setSoftDevProjectsFilter, setVersionRedmineProjectsFilter, setVersionSoftDevProjectsFilter, initRedmineVersions, loadRedmineVersions, clearRedmineVersions, refreshRedmineProjects, endRefreshingRedmineProjects, refreshSDProjects, endRefreshingSDProjects, refreshVersions, endRefreshingVersions } from './projects.actions';
import { initialState, State } from './state/projects.state';
import { ProjectCreationFromData } from './state/projects.project-creation-state';
import * as fromReducerHanders from './projects.reducer-handlers';
import { onNgrxForms, updateGroup, validate, wrapReducerWithFormStateUpdate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';
import { VersionCreationFromData } from './state/prjects.version-creation-state';

export const projectsReducerKey = 'projects';

const validationReducer = updateGroup<ProjectCreationFromData>({
    name: validate(required),
    identifier: validate(required)
});

const versionValidationReducer = updateGroup<VersionCreationFromData>({
    name: validate(required),
    sharing: validate(required)
})

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(initRedmineProjects, fromReducerHanders.initRedmineProjects),
    on(loadRedmineProjects, fromReducerHanders.loadRedmineProjects),
    on(setRedmineProjectsFilter, fromReducerHanders.setRedmineProjectsFilter),
    on(initSoftDevProjects, fromReducerHanders.initSoftDevProjects),
    on(loadSoftDevProjects, fromReducerHanders.loadSoftDevProjects),
    on(setSoftDevProjectsFilter, fromReducerHanders.setSoftDevProjectsFilter),
    on(setVersionRedmineProjectsFilter, fromReducerHanders.setVersionRedmineProjectsFilter),
    on(setVersionSoftDevProjectsFilter, fromReducerHanders.setVersionSoftDevProjectsFilter),
    on(initRedmineVersions, fromReducerHanders.initRedmineVersions),
    on(loadRedmineVersions, fromReducerHanders.loadRedmineVersions),
    on(clearRedmineVersions, fromReducerHanders.clearRedmineVersions),
    on(refreshRedmineProjects, fromReducerHanders.refreshRedmineProjects),
    on(endRefreshingRedmineProjects, fromReducerHanders.endRefreshingRedmineProjects),
    on(refreshSDProjects, fromReducerHanders.refreshSDProjects),
    on(endRefreshingSDProjects, fromReducerHanders.endRefreshingSDProjects),
    on(refreshVersions, fromReducerHanders.refreshVersions),
    on(endRefreshingVersions, fromReducerHanders.endRefreshingVersions));


export const projectsReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.projectCreationFromData;
    },
    validationReducer
);