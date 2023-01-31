import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemsReducerKey } from './items.reducer';
import { State } from './items.state';


export const getItemsState = createFeatureSelector<State>(itemsReducerKey);
export const getRedmineTrackers = createSelector(getItemsState, (state: State) => state.itemCreation.redmineTrackers);
export const getRedmineTrackersLoaded = createSelector(getItemsState, (state: State) => state.itemCreation.redmineTrackersLoaded);
export const getRedmineUsers = createSelector(getItemsState, (state: State) => state.itemCreation.redmineUsers);
export const getRedmineUsersLoaded = createSelector(getItemsState, (state: State) => state.itemCreation.redmineUsersLoaded);