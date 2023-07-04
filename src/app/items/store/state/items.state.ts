import { FormGroupState } from "ngrx-forms";
import { BatchItemCreationFormData, BatchItemCreationRecords, BatchItemCreationRedmineCriteriaFormData, BatchItemCreationSdCriteriaFormData, BatchItemCreationSdCriteriaSetupData, BatchItemCreationTMSCriteriaFormData, getBatchItemCreationFormDataInitialState, getBatchItemCreationRecordsInitialState, getBatchItemCreationRedmineCriteriaFormDataInitialState, getBatchItemCreationSdCriteriaFormDataInitialState, getBatchItemCreationSdCriteriaSetupDataInitialState, getBatchItemCreationTMSCriteriaFormDataInitialState } from "./items.batch-item-creation-state";
import { getItemCreationFromDataInitialState, getItemCreationFromIdDialogInitialState, getItemCreationSetupDataInitialState, ItemCreationFromData, ItemCreationFromIdDialog, ItemCreationSetupData } from "./items.item-creation-state";
import { ItemsSetupData, getItemsSetupDataInitialState } from "./items.common-state";

export interface State {
    itemsSetupData: ItemsSetupData;
    itemCreationSetupData: ItemCreationSetupData;
    batchItemCreationSdCriteriaSetupData: BatchItemCreationSdCriteriaSetupData;
    itemCreationFromData: FormGroupState<ItemCreationFromData>;
    itemCreationFromIdDialog: FormGroupState<ItemCreationFromIdDialog>;
    batchItemCreationSdCriteriaFormData: FormGroupState<BatchItemCreationSdCriteriaFormData>;
    batchItemCreationRecords: BatchItemCreationRecords;
    batchItemCreationFormData: FormGroupState<BatchItemCreationFormData>;
    batchItemCreationTMSCriteriaFormData: FormGroupState<BatchItemCreationTMSCriteriaFormData>;
    batchItemCreationRedmineCriteriaFormData: FormGroupState<BatchItemCreationRedmineCriteriaFormData>;
}

export const initialState: State = {
    itemsSetupData: getItemsSetupDataInitialState(),

    itemCreationSetupData: getItemCreationSetupDataInitialState(),
    itemCreationFromData: getItemCreationFromDataInitialState(),
    itemCreationFromIdDialog: getItemCreationFromIdDialogInitialState(),

    batchItemCreationSdCriteriaSetupData: getBatchItemCreationSdCriteriaSetupDataInitialState(),
    batchItemCreationRecords: getBatchItemCreationRecordsInitialState(),
    batchItemCreationSdCriteriaFormData: getBatchItemCreationSdCriteriaFormDataInitialState(),
    batchItemCreationFormData: getBatchItemCreationFormDataInitialState(),

    batchItemCreationTMSCriteriaFormData: getBatchItemCreationTMSCriteriaFormDataInitialState(),

    batchItemCreationRedmineCriteriaFormData: getBatchItemCreationRedmineCriteriaFormDataInitialState()
}