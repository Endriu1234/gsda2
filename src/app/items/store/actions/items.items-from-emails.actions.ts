import { createAction, props } from '@ngrx/store';

export const initItemsFromEmailsSettings = createAction('[Items Component] Init ItemsFromEmails Settings');
export const endInitItemsFromEmailsSettings = createAction('[Items Component] End Init ItemsFromEmails Settings');
export const setRedmineProjectsFilterForItemsFromEmail = createAction('[Items Component] Set Redmine Projects Filter For Items From Email');
export const setRedmineUsersByLetterFilterForItemsFromEmail = createAction('[Items Component] Set Redmine Users With Letter Filter ForItemsFromEmail');