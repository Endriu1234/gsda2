import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemsReducerKey } from './../items.reducer';
import { State } from '../state/items.state';

export const getItemsState = createFeatureSelector<State>(itemsReducerKey);

export const getRedmineProjectsLoaded = createSelector(getItemsState, (state: State) => state.itemsSetupData.redmineProjectsLoaded);
export const getSoftDevProjectsLoaded = createSelector(getItemsState, (state: State) => state.itemsSetupData.softDevProjectsLoaded);

export const getRedmineProjects = createSelector(getItemsState, (state: State) => state.itemsSetupData.redmineProjects);
export const getRedmineTrackers = createSelector(getItemsState, (state: State) => state.itemsSetupData.redmineTrackers);
export const getRedmineTrackersLoaded = createSelector(getItemsState, (state: State) => state.itemsSetupData.redmineTrackersLoaded);
export const getRedmineUsers = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsers);
export const getRedmineUsersLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersLoaded);

export const getSoftDevProjects = createSelector(getItemsState, (state: State) => state.itemsSetupData.softDevProjects);
