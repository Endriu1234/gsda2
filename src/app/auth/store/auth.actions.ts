import { createAction, props } from '@ngrx/store';
import { AuthDataHttpResponse } from './models/auth-data-http-response';

export const startLogin = createAction('[Auth Component] Start Login');
export const loginSuccess = createAction('[Auth Component] Login Success', props<{
    user: string,
    token: string,
    expirationDate: Date | null
}>());
export const loginFaliure = createAction('[Auth Component] Login Faliure');
export const logout = createAction('[Auth Component] Log out');
export const setRedirectURLForLogin = createAction('[Auth Component] Set redirect URL for Login', props<{ url: string }>());
export const clearRedirectURLForLogin = createAction('[Auth Component] Clear redirect URL for Login');
