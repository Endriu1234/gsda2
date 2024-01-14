import { createAction, props } from '@ngrx/store';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { ItemsFromEmailsSettings } from '../models/itemsfromemails/items-from-emails-settings.model';

export const initItemsFromEmailsSettings = createAction('[Items Component] Init ItemsFromEmails Settings');
export const endInitItemsFromEmailsSettings = createAction('[Items Component] End Init ItemsFromEmails Settings', props<{ records: ItemsFromEmailsSettings[] }>());
export const setRedmineProjectsFilterForItemsFromEmail = createAction('[Items Component] Set Redmine Projects Filter For Items From Email');
export const setRedmineUsersByLetterFilterForItemsFromEmail = createAction('[Items Component] Set Redmine Users With Letter Filter ForItemsFromEmail');
export const initRedmineVersionsForItemsFromEmail = createAction('[Items Component] Init Redmine Versions For Items From Email',
    props<{ projectName: string }>());
export const loadRedmineVersionsForItemsFromEmail = createAction('[Items Component] Load Redmine Versions For Items From Email', props<{ redmineVersions: RedmineVersion[] }>());
export const clearRedmineVersionsForItemsFromEmail = createAction('[Items Component] Clear Redmine Versions For Items From Email');
