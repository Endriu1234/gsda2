import { createReducer, on } from '@ngrx/store';
import { initialState, State } from './state/items.state';
import * as fromCommonReducerHanders from './reducer-handlers/items.common-reducer-handlers';
import * as fromItemCreationReducerHanders from './reducer-handlers/items.item-creation-reducer-handlers';
import * as fromBatchItemCreationReducerHanders from './reducer-handlers/items.batch-item-creation-reducer-handlers';
import * as fromItemsFromEmailsReducerHanders from './reducer-handlers/items.items-from-emails-reducer-handlers';

import { onNgrxForms, wrapReducerWithFormStateUpdate, updateGroup, validate, ValidationErrors } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers, initSoftDevProjects, loadRedmineProjects, loadRedmineTrackers, loadRedmineUsers, loadSoftDevProjects } from './actions/items.common-actions';
import { addValidatedCR, addValidatedFromId, addValidatedIssue, addValidatedTms, clearRedmineVersions, endResetItemCreationForm, initRedmineVersions, loadRedmineVersions, setItemCreationFormMode, setRedmineProjectsFilterForItemCreation, setRedmineUsersByLetterFilter, startResetItemCreationForm } from './actions/items.item-creation-actions';
import { continueBatchItemsCreation, forceEndBatchItemCreation, setBatchItemCreationRecords, setLinkToCurrentProposedItemAndUnselect, setRedmineProjectsFilterForBatchItemCreationSdCriteria, setSoftDevProjectsFilterForBatchItemCreationSdCriteria, startBatchItemsCreation, toggleAllPropsedItemsSelection, togglePropsedItemSelection, dragAndDropBatchItemsCreationColumns, createOneRecordFromBatch, updateBatchItemCreationFormColumn, setRedmineSourceProjectsFilterForBatchItemCreationCriteria, setRedmineTargetProjectsFilterForBatchItemCreationCriteria, setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria, setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria, initTmsClients, loadTmsClients, setTmsClientsByLetterFilter, setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria, initRedmineVersionsForIds, loadRedmineVersionsForIds, clearRedmineVersionsForIds, initRedmineVersionsForTms, loadRedmineVersionsForTms, clearRedmineVersionsForTms, initRedmineVersionsForRedmine, clearRedmineVersionsForRedmine, loadRedmineVersionsForRedmine, initRedmineVersionsForSd, loadRedmineVersionsForSd, clearRedmineVersionsForSd, setBatchItemCreationTabIndex, setBatchItemCreationSelectedTabIndex } from './actions/items.batch-item-creation-actions';
import { ItemCreationFromData } from './state/items.item-creation-state';
import {
    clearRedmineVersionsForItemsFromEmail, deleteItemsFromEmailsSetting, editItemsFromEmailsSetting,
    endInitItemsFromEmailsSettings, initItemsFromEmailsSettings, initRedmineVersionsForItemsFromEmail,
    loadRedmineVersionsForItemsFromEmail, setRedmineProjectsFilterForItemsFromEmail, setRedmineUsersByLetterFilterForItemsFromEmail, updateEditedItemsFromEmailsSetting
} from './actions/items.items-from-emails.actions';

export const itemsReducerKey = 'items';

const validationReducer = updateGroup<ItemCreationFromData>({
    tracker: validate(required),
    subject: validate(required),
    description: validate(required),
    project: validate(required)
});

export const regularReducer = createReducer(initialState, onNgrxForms(),

    on(loadRedmineProjects, fromCommonReducerHanders.loadRedmineProjects),
    on(initRedmineTrackers, fromCommonReducerHanders.initRedmineTrackers),
    on(loadRedmineTrackers, fromCommonReducerHanders.loadRedmineTrackers),
    on(initRedmineUsers, fromCommonReducerHanders.initRedmineUsers),
    on(loadRedmineUsers, fromCommonReducerHanders.loadRedmineUsers),
    on(setRedmineUsersByLetterFilter, fromCommonReducerHanders.setRedmineUsersByLetterFilter),
    on(initRedmineProjects, fromCommonReducerHanders.initRedmineProjects),
    on(initSoftDevProjects, fromCommonReducerHanders.initSoftDevProjects),
    on(loadSoftDevProjects, fromCommonReducerHanders.loadSoftDevProjects),

    on(setRedmineProjectsFilterForItemCreation, fromItemCreationReducerHanders.setRedmineProjectsFilterForItemCreation),
    on(addValidatedCR, fromItemCreationReducerHanders.addValidatedCR),
    on(addValidatedIssue, fromItemCreationReducerHanders.addValidatedIssue),
    on(addValidatedTms, fromItemCreationReducerHanders.addValidatedTms),
    on(addValidatedFromId, fromItemCreationReducerHanders.addValidatedFromId),
    on(startResetItemCreationForm, fromItemCreationReducerHanders.startResetItemCreationForm),
    on(endResetItemCreationForm, fromItemCreationReducerHanders.endResetItemCreationForm),
    on(setItemCreationFormMode, fromItemCreationReducerHanders.setItemCreationFormMode),
    on(initRedmineVersions, fromItemCreationReducerHanders.initRedmineVersions),
    on(loadRedmineVersions, fromItemCreationReducerHanders.loadRedmineVersions),
    on(clearRedmineVersions, fromItemCreationReducerHanders.clearRedmineVersions),

    on(setRedmineProjectsFilterForBatchItemCreationSdCriteria, fromBatchItemCreationReducerHanders.setRedmineProjectsFilterForBatchItemCreationSdCriteria),
    on(setSoftDevProjectsFilterForBatchItemCreationSdCriteria, fromBatchItemCreationReducerHanders.setSoftDevProjectsFilterForBatchItemCreationSdCriteria),
    on(setRedmineSourceProjectsFilterForBatchItemCreationCriteria, fromBatchItemCreationReducerHanders.setRedmineSourceProjectsFilterForBatchItemCreationCriteria),
    on(setRedmineTargetProjectsFilterForBatchItemCreationCriteria, fromBatchItemCreationReducerHanders.setRedmineTargetProjectsFilterForBatchItemCreationCriteria),
    on(setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria, fromBatchItemCreationReducerHanders.setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria),
    on(setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria, fromBatchItemCreationReducerHanders.setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria),
    on(setTmsClientsByLetterFilter, fromBatchItemCreationReducerHanders.setTmsClientsByLetterFilter),
    on(setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria, fromBatchItemCreationReducerHanders.setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria),
    on(setBatchItemCreationRecords, fromBatchItemCreationReducerHanders.setBatchItemCreationRecords),
    on(togglePropsedItemSelection, fromBatchItemCreationReducerHanders.togglePropsedItemSelection),
    on(toggleAllPropsedItemsSelection, fromBatchItemCreationReducerHanders.toggleAllPropsedItemsSelection),
    on(startBatchItemsCreation, fromBatchItemCreationReducerHanders.startBatchItemsCreation),
    on(continueBatchItemsCreation, fromBatchItemCreationReducerHanders.continueBatchItemsCreation),
    on(setLinkToCurrentProposedItemAndUnselect, fromBatchItemCreationReducerHanders.setLinkToCurrentProposedItemAndUnselect),
    on(forceEndBatchItemCreation, fromBatchItemCreationReducerHanders.forceEndBatchItemCreation),
    on(createOneRecordFromBatch, fromBatchItemCreationReducerHanders.createOneRecordFromBatch),
    on(updateBatchItemCreationFormColumn, fromBatchItemCreationReducerHanders.updateBatchItemCreationFormColumn),
    on(dragAndDropBatchItemsCreationColumns, fromBatchItemCreationReducerHanders.dragAndDropBatchItemsCreationColumns),
    on(initTmsClients, fromBatchItemCreationReducerHanders.initTmsClients),
    on(loadTmsClients, fromBatchItemCreationReducerHanders.loadTmsClients),

    on(initRedmineVersionsForIds, fromBatchItemCreationReducerHanders.initRedmineVersionsForIds),
    on(loadRedmineVersionsForIds, fromBatchItemCreationReducerHanders.loadRedmineVersionsForIds),
    on(clearRedmineVersionsForIds, fromBatchItemCreationReducerHanders.clearRedmineVersionsForIds),
    on(initRedmineVersionsForTms, fromBatchItemCreationReducerHanders.initRedmineVersionsForTms),
    on(loadRedmineVersionsForTms, fromBatchItemCreationReducerHanders.loadRedmineVersionsForTms),
    on(clearRedmineVersionsForTms, fromBatchItemCreationReducerHanders.clearRedmineVersionsForTms),
    on(initRedmineVersionsForRedmine, fromBatchItemCreationReducerHanders.initRedmineVersionsForRedmine),
    on(loadRedmineVersionsForRedmine, fromBatchItemCreationReducerHanders.loadRedmineVersionsForRedmine),
    on(clearRedmineVersionsForRedmine, fromBatchItemCreationReducerHanders.clearRedmineVersionsForRedmine),
    on(initRedmineVersionsForSd, fromBatchItemCreationReducerHanders.initRedmineVersionsForSd),
    on(loadRedmineVersionsForSd, fromBatchItemCreationReducerHanders.loadRedmineVersionsForSd),
    on(clearRedmineVersionsForSd, fromBatchItemCreationReducerHanders.clearRedmineVersionsForSd),

    on(initItemsFromEmailsSettings, fromItemsFromEmailsReducerHanders.initItemsFromEmailsSettings),
    on(endInitItemsFromEmailsSettings, fromItemsFromEmailsReducerHanders.endInitItemsFromEmailsSettings),
    on(setRedmineProjectsFilterForItemsFromEmail, fromItemsFromEmailsReducerHanders.setRedmineProjectsFilterForItemCreation),
    on(setRedmineUsersByLetterFilterForItemsFromEmail, fromItemsFromEmailsReducerHanders.setRedmineUsersByLetterFilterForItemCreation),
    on(initRedmineVersionsForItemsFromEmail, fromItemsFromEmailsReducerHanders.initRedmineVersions),
    on(loadRedmineVersionsForItemsFromEmail, fromItemsFromEmailsReducerHanders.loadRedmineVersions),
    on(clearRedmineVersionsForItemsFromEmail, fromItemsFromEmailsReducerHanders.clearRedmineVersions),
    on(deleteItemsFromEmailsSetting, fromItemsFromEmailsReducerHanders.deleteItemsFromEmailsSetting),
    on(editItemsFromEmailsSetting, fromItemsFromEmailsReducerHanders.editItemsFromEmailsSetting),
    on(updateEditedItemsFromEmailsSetting, fromItemsFromEmailsReducerHanders.updateEditedItemsFromEmailsSetting),

    on(setBatchItemCreationTabIndex, fromBatchItemCreationReducerHanders.setBatchItemCreationTabIndex),
    on(setBatchItemCreationSelectedTabIndex, fromBatchItemCreationReducerHanders.setBatchItemCreationSelectedTabIndex)
);

export const itemsReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.itemCreationFromData;
    },
    validationReducer
);

