import { createReducer, on } from '@ngrx/store';
import { LogingFormData, State, initialState } from './auth.state';
import { clearRedirectURLForLogin, loginFaliure, loginSuccess, logout, setRedirectURLForLogin, startLogin } from './auth.actions';
import * as fromReducerHanders from './auth.reducer-handlers';
import { onNgrxForms, wrapReducerWithFormStateUpdate, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';


export const authReducerKey = 'auth';

const validationReducer = updateGroup<LogingFormData>({
    user: validate(required),
    password: validate(required)
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(startLogin, fromReducerHanders.startLogin),
    on(loginSuccess, fromReducerHanders.loginSuccess),
    on(loginFaliure, fromReducerHanders.loginFaliure),
    on(logout, fromReducerHanders.logout),
    on(setRedirectURLForLogin, fromReducerHanders.setRedirectURLForLogin),
    on(clearRedirectURLForLogin, fromReducerHanders.clearRedirectURLForLogin)
);

export const authReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.loggingFormData;
    },
    validationReducer
);