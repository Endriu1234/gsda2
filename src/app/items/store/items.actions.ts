import { createAction, props } from '@ngrx/store';
import { RedmineTracker } from './models/redmine-tracker.model';
import { RedmineUser } from './models/redmine-user.model';

export const initRedmineTrackers = createAction('[Items Component] Init Redmine Trackers');
export const loadRedmineTrackers = createAction('[Items Component] Load Redmine Trackers', props<{ redmineTrackers: RedmineTracker[] }>());
export const initRedmineUsers = createAction('[Items Component] Init Redmine Users');
export const loadRedmineUsers = createAction('[Items Component] Load Redmine Users', props<{ redmineUsers: RedmineUser[] }>());