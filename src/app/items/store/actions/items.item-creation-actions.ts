import { createAction, props } from '@ngrx/store';
import { CRValidation } from '../models/cr-validation.model';
import { IssueValidation } from '../models/issue-validation.model';
import { TmsValidation } from '../models/tms-validation.model';
import { FromIdValidation } from '../models/fromId-validation.model';
import { ItemCreationMode } from '../state/items.item-creation-state';
import { RedmineVersion } from '../../../shared/store/models/redmine-version.model';
import { UserPreferences } from '../models/itemcreation/userPreferences.model';

export const startResetItemCreationForm = createAction('[Items Component] Start Reset Item Creation From');
export const endResetItemCreationForm = createAction('[Items Component] End Reset Item Creation From');
export const setItemCreationFormMode = createAction('[Items Component] Set Item Creation Form Mode', props<{ mode: ItemCreationMode }>());
export const setRedmineProjectsFilterForItemCreation = createAction('[Items Component] Set Redmine Projects Filter For Item Creation');
export const setRedmineUsersByLetterFilter = createAction('[Items Component] Set Redmine Users With Letter Filter');

export const addValidatedCR = createAction('[Items Component] Add Validated CR', props<{ validatedCR: CRValidation }>());
export const addValidatedIssue = createAction('[Items Component] Add Validated Issue', props<{ validatedIssue: IssueValidation }>());
export const addValidatedTms = createAction('[Items Component] Add Validated Tms', props<{ validatedTms: TmsValidation }>());
export const addValidatedFromId = createAction('[Items Component Dialog] Add Validated FromId', props<{ validatedFromId: FromIdValidation }>());

export const fillItemById = createAction('[Items Component] Find The Item By Id');
export const identifyAndFillItemById = createAction('[Items Component] Identify And Find The Item By Id');
export const breakBatchItemCreation = createAction('[Items Component] Break Batch Item Creation');

export const initRedmineVersions = createAction('[Items Component] Init Redmine Versions', props<{ projectName: string }>());
export const loadRedmineVersions = createAction('[Items Component] Load Redmine Versions', props<{ redmineVersions: RedmineVersion[] }>());
export const clearRedmineVersions = createAction('[Items Component] Clear Redmine Versions');

export const startLoadingItemCreationUserPreferences = createAction('[Items Component] Start Loading Item Creation User Preferences');
export const endLoadingItemCreationUserPreferences = createAction('[Items Component] End Loading Item Creation User Preferences', props<{ preferences: UserPreferences | null }>()); 
export const loadItemCreationUserPreferencesSetup = createAction('[Items Component] Load Item Creation User Preferences Setup');
export const setItemCreationUserPreferencesSetupByCtrl = createAction('[Items Component] Set Item Creation User Preferences Setup By Control', props<{ control: string }>());
export const saveItemCreationUserPreferences = createAction('[Items Component] Save Item Creation User Preferences', props<{ updateSetup: boolean }>());
export const setItemControlsByUserPreferences = createAction('[Items Component] Set Item Control By User Preferences', props<{ preferences: UserPreferences | null }>()); 

export const refreshVersions = createAction('[Items Component] Refresh Redmine Versions');
export const endRefreshingVersions = createAction('[Items Component] End Refreshing Redmine Versions');