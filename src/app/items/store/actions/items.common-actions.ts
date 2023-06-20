import { createAction, props } from '@ngrx/store';
import { RedmineTracker } from '../models/redmine-tracker.model';
import { RedmineUser } from '../models/redmine-user.model';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { SoftDevProject } from 'src/app/shared/store/models/softdev-project.model';


export const initRedmineTrackers = createAction('[Items Component] Init Redmine Trackers');
export const loadRedmineTrackers = createAction('[Items Component] Load Redmine Trackers', props<{ redmineTrackers: RedmineTracker[] }>());

export const initRedmineUsers = createAction('[Items Component] Init Redmine Users');
export const loadRedmineUsers = createAction('[Items Component] Load Redmine Users', props<{ redmineUsers: RedmineUser[] }>());

export const initRedmineProjects = createAction('[Items Component] Init Redmine Projects');
export const loadRedmineProjects = createAction('[Items Component] Load Redmine Projects', props<{ redmineProjects: RedmineProject[] }>());

export const initSoftDevProjects = createAction('[Items Component] Init SoftDev Projects');
export const loadSoftDevProjects = createAction('[Items Component] Load SoftDev Projects', props<{ softDevProjects: SoftDevProject[] }>());

export const noopAction = createAction('[Items Component] Noop Action');
