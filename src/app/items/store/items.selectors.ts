import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemsReducerKey } from './items.reducer';
import { State } from './items.state';


export const getItemsState = createFeatureSelector<State>(itemsReducerKey);
export const getItemCreationSetupData = createSelector(getItemsState, (state: State) => state.itemCreationSetupData);
export const getRedmineTrackers = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineTrackers);
export const getRedmineTrackersLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineTrackersLoaded);
export const getRedmineUsers = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsers);
export const getRedmineUsersFiltered = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersFiltered);
export const getRedmineUsersLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersLoaded);
export const getRedmineProjects = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjects);
export const getRedmineProjectsFiltered = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjectsFiltered);
export const getRedmineProjectsLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjectsLoaded);
export const getValidatedCRs = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedCRs);
export const getItemCreationFormState = createSelector(getItemsState, (state: State) => state.itemCreationFromData);