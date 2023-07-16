import { createAction, props } from '@ngrx/store';

export const startLogin = createAction('[Auth Component] Start Login');
export const loginSuccess = createAction('[Auth Component] Login Success');
export const loginFaliure = createAction('[Auth Component] Login Faliure');
export const logout = createAction('[Auth Component] Log out');
