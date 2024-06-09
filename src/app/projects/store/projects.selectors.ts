import { createFeatureSelector, createSelector } from '@ngrx/store';
import { projectsReducerKey } from './projects.reducer';
import { State } from './state/projects.state';
import { canProjectCreationFormBeSaved, canVersionCreationFormBeSaved, canVersionCreationFormBeUpdated } from './projects.selectors-handlers';


export const getProjectsState = createFeatureSelector<State>(projectsReducerKey);
export const getRedmineProjects = createSelector(getProjectsState, (state: State) => state.projectsSetupData.redmineProjects);
export const getRedmineProjectsFiltered = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.redmineProjectsFiltered);
export const getRedmineProjectsLoaded = createSelector(getProjectsState, (state: State) => state.projectsSetupData.redmineProjectsLoaded);
export const getSoftDevProjects = createSelector(getProjectsState, (state: State) => state.projectsSetupData.softDevProjects);
export const getSoftDevProjectsFiltered = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.softdevProjectsFiltered);
export const getSoftDevProjectsLoaded = createSelector(getProjectsState, (state: State) => state.projectsSetupData.softDevProjectsLoaded);
export const getValidatedIdentifiers = createSelector(getProjectsState, (state: State) => state.projectCreationSetupData.validatedIdentifiers);
export const getProjectCreationFormState = createSelector(getProjectsState, (state: State) => state.projectCreationFromData);
export const getProjectCreationDialogState = createSelector(getProjectsState, (state: State) => state.projectCreationFromIdDialog);
export const getProjectCreationFormCanActivateSave = createSelector(getProjectCreationFormState, canProjectCreationFormBeSaved);
export const getVersionCreationFormState = createSelector(getProjectsState, (state: State) => state.versionCreationFormData);
export const getRedmineProjectsForVersionFiltered = createSelector(getProjectsState, (state: State) => state.versionCreationSetupData.redmineProjectsFiltered);
export const getSoftDevProjectsForVersionFiltered = createSelector(getProjectsState, (state: State) => state.versionCreationSetupData.softdevProjectsFiltered);
export const getRedmineVersionsByProject = createSelector(getProjectsState, (state: State) => state.versionCreationSetupData.redmineVersions);
export const canActivateVersionSave = createSelector(getVersionCreationFormState, canVersionCreationFormBeSaved);
export const canActivateVersionUpdate = createSelector(getVersionCreationFormState, canVersionCreationFormBeUpdated);
export const isRedmineProjectRefreshingInProgress = createSelector(getProjectsState, (state: State) => state.versionCreationSetupData.refreshingRedmineProjects);
export const isSDProjectRefreshingInProgress = createSelector(getProjectsState, (state: State) => state.versionCreationSetupData.refreshingSDProjects);
export const isVersionRefreshingInProgress = createSelector(getProjectsState, (state: State) => state.versionCreationSetupData.refreshingVersions);
