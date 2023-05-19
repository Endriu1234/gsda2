import { createFeatureSelector, createSelector } from '@ngrx/store';
import { projectsReducerKey } from './projects.reducer';
import { State } from './projects.state';
import { canProjectCreationFormBeSaved } from './projects.selectors-handlers';


export const getProjectsState = createFeatureSelector<State>(projectsReducerKey);
export const getRedmineProjects = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.redmineProjects);
export const getRedmineProjectsFiltered = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.redmineProjectsFiltered);
export const getRedmineProjectsLoaded = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.redmineProjectsLoaded);
export const getSoftDevProjects = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.softdevProjects);
export const getSoftDevProjectsFiltered = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.softdevProjectsFiltered);
export const getSoftDevProjectsLoaded = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.softdevProjectsLoaded);
export const getValidatedIdentifiers = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.validatedIdentifiers);
export const getProjectCreationFormState = createSelector(getProjectsState, (state: State) => state.projectCreationFromData);
export const getProjectCreationDialogState = createSelector(getProjectsState, (state: State) => state.projectCreationFromIdDialog);
export const getProjectCreationFormCanActivateSave = createSelector(getProjectCreationFormState, canProjectCreationFormBeSaved);