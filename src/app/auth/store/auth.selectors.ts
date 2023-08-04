import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.state';
import { authReducerKey } from './auth.reducer';


export const getAuthState = createFeatureSelector<State>(authReducerKey);

export const getIsUserLogged = createSelector(getAuthState, (state: State) => state.token != null);
export const getUserLogin = createSelector(getAuthState, (state: State) => state.user);
export const getToken = createSelector(getAuthState, (state: State) => state.token);
export const getRedirectURL = createSelector(getAuthState, (state: State) => state.redirectURL);

export const getLoggingFormData = createSelector(getAuthState, (state: State) => state.loggingFormData);
