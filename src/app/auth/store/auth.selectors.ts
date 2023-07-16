import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.state';
import { authReducerKey } from './auth.reducer';


export const getAuthState = createFeatureSelector<State>(authReducerKey);

export const getIsUserLogged = createSelector(getAuthState, (state: State) => state.logged);

export const getLoggingFormData = createSelector(getAuthState, (state: State) => state.loggingFormData);
