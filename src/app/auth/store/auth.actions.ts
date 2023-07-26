import { createAction, props } from '@ngrx/store';
import { AuthDataHttpResponse } from './models/auth-data-http-response';

export const startLogin = createAction('[Auth Component] Start Login');
export const loginSuccess = createAction('[Auth Component] Login Success', props<{ authData: AuthDataHttpResponse }>());
export const loginFaliure = createAction('[Auth Component] Login Faliure');
export const logout = createAction('[Auth Component] Log out');
