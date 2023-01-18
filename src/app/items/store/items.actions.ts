import { createAction, props } from '@ngrx/store';
import { RedmineTracker } from './models/redmine-tracker.model';

export const initRedmineTrackers = createAction('[Items Component] Init Redmine Trackers');
export const loadRedmineTrackers = createAction('[Items Component] Load Redmine Trackers', props<{ redmineTrackers: RedmineTracker[] }>());