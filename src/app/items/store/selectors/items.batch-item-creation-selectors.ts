import { createSelector } from '@ngrx/store';
import { State } from '../state/items.state';
import { getItemsState } from './items.common-selectors';
import { FormGroupState } from 'ngrx-forms';
import { BatchItemCreationIdsCriteriaFormData, BatchItemCreationRecords, BatchItemCreationRedmineCriteriaFormData, BatchItemCreationSdCriteriaFormData, BatchItemCreationTMSCriteriaFormData } from '../state/items.batch-item-creation-state';

export const getBatchItemCreationSDCriteriaSearchFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaFormData);
export const getBatchItemCreationSdCriteriaFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaFormData);

export const getRedmineProjectsFilteredForBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaSetupData.redmineProjectsFiltered);
export const getSoftDevProjectsFilteredForBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaSetupData.softDevProjectsFiltered);

export const getBatchItemCreationRecords = createSelector(getItemsState, (state: State) => state.batchItemCreationRecords);
export const getBatchItemCreationFormData = createSelector(getItemsState, (state: State) => state.batchItemCreationFormData);
export const getBatchItemCreationFormDataAddon = createSelector(getItemsState, (state: State) => state.batchItemCreationFormDataAddon);

export const getBatchItemCreationTMSCriteriaFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationTMSCriteriaFormData);

export const getRedmineSourceProjectsFilteredForBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationRedmineCriteriaSetupData.redmineSourceProjectsFiltered);
export const getRedmineTargetProjectsFilteredForBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationRedmineCriteriaSetupData.redmineTargetProjectsFiltered);
export const getBatchItemCreationRedmineCriteriaFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationRedmineCriteriaFormData);
export const getBatchItemCreationGridRemovableColumns = createSelector(getItemsState, (state: State) => state.batchItemCreationGridRemovableColumns);

export const getRedmineUsersByLetterFiltered = createSelector(getItemsState, (state: State) => state.batchItemCreationTMSCriteriaSetupData.redmineUsersByLetterFiltered);

export const getRedmineTargetProjectsFilteredForTmsBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationTMSCriteriaSetupData.redmineTargetProjectsFiltered);

export const getTmsClientsLoaded = createSelector(getItemsState, (state: State) => state.batchItemCreationTMSCriteriaSetupData.tmsClientsLoaded);
export const getTmsClientsByLetterFiltered = createSelector(getItemsState, (state: State) => state.batchItemCreationTMSCriteriaSetupData.tmsClientsByLetterFiltered);
export const getTmsClients = createSelector(getItemsState, (state: State) => state.batchItemCreationTMSCriteriaSetupData.tmsClients);

export const getBatchItemCreationIdsCriteriaFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationIdsCriteriaFormData);
export const getRedmineProjectsFilteredForIdsBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationIdsCriteriaSetupData.redmineTargetProjectsFiltered);

export const getBatchItemsRecordsWithFormData = createSelector(getBatchItemCreationRecords, getBatchItemCreationFormData, (batchRecords, batchFormData) => {
    return {
        batchRecords: batchRecords,
        batchFormData: batchFormData
    }
});

export const getBatchItemCreationSDCriteriaCanActivateFind = createSelector(getBatchItemCreationSdCriteriaFormState, canBatchItemCreationSDCriteriaActivateFind);

function canBatchItemCreationSDCriteriaActivateFind(formState: FormGroupState<BatchItemCreationSdCriteriaFormData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid 
        || !formState.controls.itemLevel.value
        || !formState.controls.sourceSoftDevProject.value 
        || !formState.controls.targetRedmineProject.value) {
        return false;
    }

    return true;
}

export const getBatchItemCreationRmCriteriaCanActivateFind = createSelector(getBatchItemCreationRedmineCriteriaFormState, canBatchItemCreationRmCriteriaActivateFind);

function canBatchItemCreationRmCriteriaActivateFind(formState: FormGroupState<BatchItemCreationRedmineCriteriaFormData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid 
        || !formState.controls.sourceRedmineProject.value 
        || !formState.controls.targetRedmineProject.value) {
        return false;
    }

    return true;
}

export const getBatchItemCreationCanActivateGrid = createSelector(getBatchItemCreationRecords, canBatchItemCreationCanActivateGrid);

function canBatchItemCreationCanActivateGrid(batchRecords: BatchItemCreationRecords): boolean {
    if (!batchRecords.proposedItems || batchRecords.proposedItems.length <= 0) {
        return false;
    }

    return true;
}

export const getBatchItemCreationTmsCriteriaCanActivateFind = createSelector(getBatchItemCreationTMSCriteriaFormState, canActivateTMSFind);

function canActivateTMSFind(formState: FormGroupState<BatchItemCreationTMSCriteriaFormData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid 
        || !formState.controls.iTMSClient.value 
        || !formState.controls.targetRedmineProject.value) {
        return false;
    }

    return true;
}

export const getBatchItemCreationIdsCriteriaCanActivateFind = createSelector(getBatchItemCreationIdsCriteriaFormState, canBatchItemCreationIdsCriteriaActivateFind);

function canBatchItemCreationIdsCriteriaActivateFind(formState: FormGroupState<BatchItemCreationIdsCriteriaFormData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid 
        || !formState.controls.allIds.value
        || !formState.controls.targetRedmineProject.value) {
        return false;
    }

    return true;
}

export const getBatchItemCreationFormColumns = createSelector(getBatchItemCreationFormDataAddon, (batchFormDataAddon) => {
    return batchFormDataAddon.value.displayedColumns;
});
export const getBatchItemCreationFormColumnsLength = createSelector(getBatchItemCreationFormDataAddon, (batchFormDataAddon) => {
    return batchFormDataAddon.value.displayedColumns.length;
});
export const getIsAnyBatchItemsRecordsSelected = createSelector(getBatchItemCreationRecords, (batchRecords) => {
    let retVal = false;
    if (batchRecords && batchRecords.proposedItems) {
        retVal = batchRecords.proposedItems.some(p => p.SELECTED);
    }

    return retVal;
})

