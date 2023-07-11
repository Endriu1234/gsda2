import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { startLogin } from './auth.actions';
import * as fromReducerHanders from './auth.reducer-handlers';

export const authReducerKey = 'auth';

export const authReducer = createReducer(initialState,
    on(startLogin, fromReducerHanders.startLogin)
);