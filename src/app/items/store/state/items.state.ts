import { FormGroupState } from "ngrx-forms";
import { BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS, BatchItemCreation, BatchItemCreationFormData, BatchItemCreationFormDataAddon, BatchItemCreationIdsCriteriaFormData, BatchItemCreationIdsCriteriaSetupData, BatchItemCreationRecords, BatchItemCreationRedmineCriteriaFormData, BatchItemCreationRedmineCriteriaSetupData, BatchItemCreationSdCriteriaFormData, BatchItemCreationSdCriteriaSetupData, BatchItemCreationTMSCriteriaFormData, BatchItemCreationTmsCriteriaSetupData, getBatchItemCreationFormDataAddonInitialState, getBatchItemCreationFormDataInitialState, getBatchItemCreationIdsCriteriaFormDataInitialState, getBatchItemCreationIdsCriteriaSetupDataInitialState, getBatchItemCreationRecordsInitialState, getBatchItemCreationRedmineCriteriaFormDataInitialState, getBatchItemCreationRedmineCriteriaSetupDataInitialState, getBatchItemCreationSdCriteriaFormDataInitialState, getBatchItemCreationSdCriteriaSetupDataInitialState, getBatchItemCreationTMSCriteriaFormDataInitialState, getBatchItemCreationTmsCriteriaSetupDataInitialState, getBatchItemCreationnitialState } from "./items.batch-item-creation-state";
import { getItemCreationFromDataInitialState, getItemCreationFromIdDialogInitialState, getItemCreationSetupDataInitialState, ItemCreationFromData, ItemCreationFromIdDialog, ItemCreationSetupData } from "./items.item-creation-state";
import { ItemsSetupData, getItemsSetupDataInitialState } from "./items.common-state";
import {
    ItemsFromEmailsSettingsFormData, ItemsFromEmailsSettingsSetupData, getItemsFromEmailsSettingsFormDataInitialState,
    getItemsFromEmailsSettingsSetupDataInitialState
} from "./items.items-from-emails-state";

export interface State {
    itemsSetupData: ItemsSetupData;
    itemCreationSetupData: ItemCreationSetupData;
    batchItemCreationSdCriteriaSetupData: BatchItemCreationSdCriteriaSetupData;
    itemCreationFromData: FormGroupState<ItemCreationFromData>;
    itemCreationFromIdDialog: FormGroupState<ItemCreationFromIdDialog>;
    batchItemCreationSdCriteriaFormData: FormGroupState<BatchItemCreationSdCriteriaFormData>;
    batchItemCreation: BatchItemCreation;
    batchItemCreationRecords: BatchItemCreationRecords;
    batchItemCreationFormData: FormGroupState<BatchItemCreationFormData>;
    batchItemCreationFormDataAddon: FormGroupState<BatchItemCreationFormDataAddon>;
    batchItemCreationTMSCriteriaSetupData: BatchItemCreationTmsCriteriaSetupData;
    batchItemCreationTMSCriteriaFormData: FormGroupState<BatchItemCreationTMSCriteriaFormData>;
    batchItemCreationRedmineCriteriaSetupData: BatchItemCreationRedmineCriteriaSetupData;
    batchItemCreationRedmineCriteriaFormData: FormGroupState<BatchItemCreationRedmineCriteriaFormData>;
    batchItemCreationGridRemovableColumns: string[];
    batchItemCreationIdsCriteriaSetupData: BatchItemCreationIdsCriteriaSetupData;
    batchItemCreationIdsCriteriaFormData: FormGroupState<BatchItemCreationIdsCriteriaFormData>;
    itemsFromEmailsSettingsFormData: FormGroupState<ItemsFromEmailsSettingsFormData>;
    itemsFromEmailsSettingsSetupData: ItemsFromEmailsSettingsSetupData;
}

export const initialState: State = {
    itemsSetupData: getItemsSetupDataInitialState(),

    itemCreationSetupData: getItemCreationSetupDataInitialState(),
    itemCreationFromData: getItemCreationFromDataInitialState(),
    itemCreationFromIdDialog: getItemCreationFromIdDialogInitialState(),
    batchItemCreation: getBatchItemCreationnitialState(),

    batchItemCreationSdCriteriaSetupData: getBatchItemCreationSdCriteriaSetupDataInitialState(),
    batchItemCreationRecords: getBatchItemCreationRecordsInitialState(),
    batchItemCreationSdCriteriaFormData: getBatchItemCreationSdCriteriaFormDataInitialState(),
    batchItemCreationFormData: getBatchItemCreationFormDataInitialState(),
    batchItemCreationFormDataAddon: getBatchItemCreationFormDataAddonInitialState(),

    batchItemCreationTMSCriteriaSetupData: getBatchItemCreationTmsCriteriaSetupDataInitialState(),
    batchItemCreationTMSCriteriaFormData: getBatchItemCreationTMSCriteriaFormDataInitialState(),

    batchItemCreationRedmineCriteriaSetupData: getBatchItemCreationRedmineCriteriaSetupDataInitialState(),
    batchItemCreationRedmineCriteriaFormData: getBatchItemCreationRedmineCriteriaFormDataInitialState(),
    batchItemCreationGridRemovableColumns: BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS,

    batchItemCreationIdsCriteriaSetupData: getBatchItemCreationIdsCriteriaSetupDataInitialState(),
    batchItemCreationIdsCriteriaFormData: getBatchItemCreationIdsCriteriaFormDataInitialState(),

    itemsFromEmailsSettingsFormData: getItemsFromEmailsSettingsFormDataInitialState(),
    itemsFromEmailsSettingsSetupData: getItemsFromEmailsSettingsSetupDataInitialState()
}