import { FormGroupState } from "ngrx-forms";
import { BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS, BatchItemCreationFormData, BatchItemCreationFormDataAddon, BatchItemCreationRecords, BatchItemCreationRedmineCriteriaFormData, BatchItemCreationRedmineCriteriaSetupData, BatchItemCreationSdCriteriaFormData, BatchItemCreationSdCriteriaSetupData, BatchItemCreationTMSCriteriaFormData, getBatchItemCreationFormDataAddonInitialState, getBatchItemCreationFormDataInitialState, getBatchItemCreationRecordsInitialState, getBatchItemCreationRedmineCriteriaFormDataInitialState, getBatchItemCreationRedmineCriteriaSetupDataInitialState, getBatchItemCreationSdCriteriaFormDataInitialState, getBatchItemCreationSdCriteriaSetupDataInitialState, getBatchItemCreationTMSCriteriaFormDataInitialState } from "./items.batch-item-creation-state";
import { getItemCreationFromDataInitialState, getItemCreationFromIdDialogInitialState, getItemCreationSetupDataInitialState, ItemCreationFromData, ItemCreationFromIdDialog, ItemCreationSetupData } from "./items.item-creation-state";
import { ItemsSetupData, getItemsSetupDataInitialState } from "./items.common-state";
import { ItemsFromEmailsGeneralSettingsFormData, getItemsFromEmailsGeneralSettingsFormDataInitialState } from "./items.items-from-emails-state";

export interface State {
    itemsSetupData: ItemsSetupData;
    itemCreationSetupData: ItemCreationSetupData;
    batchItemCreationSdCriteriaSetupData: BatchItemCreationSdCriteriaSetupData;
    itemCreationFromData: FormGroupState<ItemCreationFromData>;
    itemCreationFromIdDialog: FormGroupState<ItemCreationFromIdDialog>;
    batchItemCreationSdCriteriaFormData: FormGroupState<BatchItemCreationSdCriteriaFormData>;
    batchItemCreationRecords: BatchItemCreationRecords;
    batchItemCreationFormData: FormGroupState<BatchItemCreationFormData>;
    batchItemCreationFormDataAddon: FormGroupState<BatchItemCreationFormDataAddon>;
    batchItemCreationTMSCriteriaFormData: FormGroupState<BatchItemCreationTMSCriteriaFormData>;
    batchItemCreationRedmineCriteriaSetupData: BatchItemCreationRedmineCriteriaSetupData;
    batchItemCreationRedmineCriteriaFormData: FormGroupState<BatchItemCreationRedmineCriteriaFormData>;
    batchItemCreationGridRemovableColumns: string[];
    itemsFromEmailsGeneralSettingsFormData: FormGroupState<ItemsFromEmailsGeneralSettingsFormData>;
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
    batchItemCreationFormDataAddon: getBatchItemCreationFormDataAddonInitialState(),

    batchItemCreationTMSCriteriaFormData: getBatchItemCreationTMSCriteriaFormDataInitialState(),

    batchItemCreationRedmineCriteriaSetupData: getBatchItemCreationRedmineCriteriaSetupDataInitialState(),
    batchItemCreationRedmineCriteriaFormData: getBatchItemCreationRedmineCriteriaFormDataInitialState(),
    batchItemCreationGridRemovableColumns: BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS,

    itemsFromEmailsGeneralSettingsFormData: getItemsFromEmailsGeneralSettingsFormDataInitialState()
}