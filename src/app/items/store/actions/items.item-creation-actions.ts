import { createAction, props } from '@ngrx/store';
import { CRValidation } from '../models/cr-validation.model';
import { IssueValidation } from '../models/issue-validation.model';
import { TmsValidation } from '../models/tms-validation.model';
import { FromIdValidation } from '../models/fromId-validation.model';

export const resetItemCreationForm = createAction('[Items Component] Reset Item Creation From');
export const setRedmineProjectsFilterForItemCreation = createAction('[Items Component] Set Redmine Projects Filter For Item Creation');
export const setRedmineUsersByLetterFilter = createAction('[Items Component] Set Redmine Users With Letter Filter');

export const addValidatedCR = createAction('[Items Component] Add Validated CR', props<{ validatedCR: CRValidation }>());
export const addValidatedIssue = createAction('[Items Component] Add Validated Issue', props<{ validatedIssue: IssueValidation }>());
export const addValidatedTms = createAction('[Items Component] Add Validated Tms', props<{ validatedTms: TmsValidation }>());
export const addValidatedFromId = createAction('[Items Component Dialog] Add Validated FromId', props<{ validatedFromId: FromIdValidation }>());

export const fillItemById = createAction('[Items Component] Find The Item By Id');
export const identifyAndFillItemById = createAction('[Items Component] Identify And Find The Item By Id');
