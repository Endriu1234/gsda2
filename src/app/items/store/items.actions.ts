import { createAction, props } from '@ngrx/store';
import { CRValidation } from './models/cr-validation.model';
import { RedmineProject } from './models/redmine-project.model';
import { RedmineTracker } from './models/redmine-tracker.model';
import { RedmineUser } from './models/redmine-user.model';

export const initRedmineTrackers = createAction('[Items Component] Init Redmine Trackers');
export const loadRedmineTrackers = createAction('[Items Component] Load Redmine Trackers', props<{ redmineTrackers: RedmineTracker[] }>());
export const initRedmineUsers = createAction('[Items Component] Init Redmine Users');
export const loadRedmineUsers = createAction('[Items Component] Load Redmine Users', props<{ redmineUsers: RedmineUser[] }>());
export const setRedmineUsersFilter = createAction('[Items Component] Set Redmine Users Filter');
export const initRedmineProjects = createAction('[Items Component] Init Redmine Projects');
export const loadRedmineProjects = createAction('[Items Component] Load Redmine Projects', props<{ redmineProjects: RedmineProject[] }>());
export const setRedmineProjectsFilter = createAction('[Items Component] Set Redmine Projects Filter');
export const addValidatedCR = createAction('[Items Component] Add Validated CR', props<{ validatedCR: CRValidation }>());

export const noopAction = createAction('[Items Component] Noop Action');
