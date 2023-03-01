import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { addSnackbarNotification, clearDisplayedSnackbarNotifications } from './shared.actions';
import * as fromReducerHanders from './shared.reducer-handlers';

export interface SnackbarNotification {
    timestamp: number;
    notification: string;
}

export interface State {
    snackbarNotifications: SnackbarNotification[];
}

const initialState: State = {
    snackbarNotifications: []
}

export const sharedReducerKey = 'shared';

export const sharedReducer = createReducer(initialState,
    on(addSnackbarNotification, fromReducerHanders.addSnackbarNotification),
    on(clearDisplayedSnackbarNotifications, fromReducerHanders.clearDisplayedSnackbarNotifications)
);

export const getSharedState = createFeatureSelector<State>(sharedReducerKey);
export const getSnackbarNotifications = createSelector(getSharedState, (state: State) => state.snackbarNotifications);