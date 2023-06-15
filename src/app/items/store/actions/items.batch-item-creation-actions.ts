import { createAction, props } from '@ngrx/store';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';

export const setRedmineProjectsFilterForBatchItemCreationSdCriteria = createAction('[Items Component] Set Redmine Projects Filter For Batch Item Creation Sd Criteria');
export const setSoftDevProjectsFilterForBatchItemCreationSdCriteria = createAction('[Items Component] Set SoftDev Projects Filter For Batch Item Creation Sd Criteria');
export const setBatchItemCreationRecords = createAction('[Items Component] Set Batch Item Creation Records', props<{ proposedItems: ProposedItem[] }>());
