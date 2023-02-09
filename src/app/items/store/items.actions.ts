import { createAction, props } from '@ngrx/store';
import { RedmineProject } from './models/redmine-project.model';
import { RedmineProjectsFilter } from './models/redmine-project-filter';
import { RedmineTracker } from './models/redmine-tracker.model';
import { RedmineUsersFilter } from './models/redmine-user-filter';
import { RedmineUser } from './models/redmine-user.model';
import { RedmineUsersByLetterFilter } from './models/redmine-user-letter-filter';

export const initRedmineTrackers = createAction('[Items Component] Init Redmine Trackers');
export const loadRedmineTrackers = createAction('[Items Component] Load Redmine Trackers', props<{ redmineTrackers: RedmineTracker[] }>());
export const initRedmineUsers = createAction('[Items Component] Init Redmine Users');
export const loadRedmineUsers = createAction('[Items Component] Load Redmine Users', props<{ redmineUsers: RedmineUser[] }>());
export const setRedmineUsersFilter = createAction('[Items Component] Set Redmine Users Filter', props<{ redmineUsersFilter: RedmineUsersFilter }>());
export const setRedmineUsersByLetterFilter = createAction('[Items Component] Set Redmine Users With Letter Filter', props<{ redmineUsersByLetterFilter: RedmineUsersByLetterFilter }>());
export const initRedmineProjects = createAction('[Items Component] Init Redmine Projects');
export const loadRedmineProjects = createAction('[Items Component] Load Redmine Projects', props<{ redmineProjects: RedmineProject[] }>());
export const setRedmineProjectsFilter = createAction('[Items Component] Set Redmine Projects Filter', props<{ redmineProjectsFilter: RedmineProjectsFilter }>());