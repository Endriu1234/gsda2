import { createAction, props } from '@ngrx/store';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';

export const setRedmineProjectsFilterForBatchItemCreationSdCriteria = createAction('[Items Component] Set Redmine Projects Filter For Batch Item Creation Sd Criteria');
export const setSoftDevProjectsFilterForBatchItemCreationSdCriteria = createAction('[Items Component] Set SoftDev Projects Filter For Batch Item Creation Sd Criteria');
export const setBatchItemCreationRecords = createAction('[Items Component] Set Batch Item Creation Records', props<{ proposedItems: ProposedItem[] }>());
export const togglePropsedItemSelection = createAction('[Items Component] Toggle Proposed Item Selection', props<{ proposedItem: ProposedItem }>());
export const toggleAllPropsedItemsSelection = createAction('[Items Component] Toggle All Proposed Items Selection');
export const startBatchItemsCreation = createAction('[Items Component] Start Batch Items Creation');
export const forceEndBatchItemCreation = createAction('[Items Component] Force End Batch Items Creation');
export const continueBatchItemsCreation = createAction('[Items Component] Continue Batch Items Creation');
export const setLinkToCurrentProposedItemAndUnselect = createAction('[Items Component] set Link to current Proposed Item and unselect', props<{ redmineLink: string }>());
export const deleteBatchItemCreationFormColumn = createAction('[Items Component] delete Column From Batch Item Grid', props<{ column: string }>());
export const addBatchItemCreationFormColumn = createAction('[Items Component] add Deleted Column To Batch Item Grid');
export const dragAndDropBatchItemsCreationColumns = createAction('[Items Component] Drag And Drop Columns in Batch Item Grid', props<{ prevIndex: number, currIndex: number }>());
export const createOneRecordFromBatch = createAction('[Items Component] Create One Record From Batch', props<{ proposedItem: ProposedItem }>());