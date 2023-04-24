import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { addSnackbarNotification, clearDisplayedSnackbarNotifications } from './shared.actions';
import * as fromReducerHanders from './shared.reducer-handlers';
import { initialState, State } from './shared.state';


export const sharedReducerKey = 'shared';

export const sharedReducer = createReducer(initialState,
    on(addSnackbarNotification, fromReducerHanders.addSnackbarNotification),
    on(clearDisplayedSnackbarNotifications, fromReducerHanders.clearDisplayedSnackbarNotifications)
);

export const getSharedState = createFeatureSelector<State>(sharedReducerKey);
export const getSnackbarNotifications = createSelector(getSharedState, (state: State) => state.snackbarNotifications);