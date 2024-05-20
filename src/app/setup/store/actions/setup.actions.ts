import { createAction } from '@ngrx/store';

export const refreshCache = createAction('[Setup Component] Refresh Cache');
export const endRefreshCache = createAction('[Setup Component] End Refresh Cache');
export const refreshVersions = createAction('[Setup Component] Refresh Versions');
export const endRefreshVersions = createAction('[Setup Component] End Refresh Versions');
export const refreshSDProjects = createAction('[Setup Component] Refresh SD Projects');
export const endRefreshSDProjects = createAction('[Setup Component] End Refresh SD Projects');
export const refreshRedmineProjects = createAction('[Setup Component] Refresh Redmine Projects');
export const endRefreshRedmineProjects = createAction('[Setup Component] End Refresh Redmine Projects');
export const refreshCustomFields = createAction('[Setup Component] Refresh Custom Fields');
export const endRefreshCustomFields = createAction('[Setup Component] End Refresh Custom Fields');
export const refreshEmailSettings = createAction('[Setup Component] Refresh Email Settings');
export const endRefreshEmailSettings = createAction('[Setup Component] End Refresh Email Settings');
export const refreshUserPreferences = createAction('[Setup Component] Refresh User Preferences');
export const endRefreshUserPreferences = createAction('[Setup Component] End Refresh User Preferences');
export const noopAction = createAction('[Setup Component] Noop Action');