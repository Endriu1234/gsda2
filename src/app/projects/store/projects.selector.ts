import { createFeatureSelector, createSelector } from '@ngrx/store';
import { projectsReducerKey } from './projects.reducer';
import { State } from './projects.state';


export const getProjectsState = createFeatureSelector<State>(projectsReducerKey);
export const getRedmineProjects = createSelector(getProjectsState, (state: State) => state.projectCreation.redmineProjects);
export const getRedmineProjectsFiltered = createSelector(getProjectsState, (state: State) => state.projectCreation.redmineProjectsFiltered);
export const getRedmineProjectsLoaded = createSelector(getProjectsState, (state: State) => state.projectCreation.redmineProjectsLoaded);
export const getSoftDevProjects = createSelector(getProjectsState, (state: State) => state.projectCreation.softdevProjects);
export const getSoftDevProjectsFiltered = createSelector(getProjectsState, (state: State) => state.projectCreation.softdevProjectsFiltered);
export const getSoftDevProjectsLoaded = createSelector(getProjectsState, (state: State) => state.projectCreation.softdevProjectsLoaded);