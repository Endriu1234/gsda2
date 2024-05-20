import { createAction } from '@ngrx/store';

export const refreshCache = createAction('[Setup Component] Refresh Cache');
export const endRefreshCache = createAction('[Setup Component] End Refresh Cache');
export const noopAction = createAction('[Setup Component] Noop Action');