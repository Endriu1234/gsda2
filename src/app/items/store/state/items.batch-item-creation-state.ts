import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";
import { ProposedItem } from "../models/batchitemcreation/proposed-item.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";

export const BATCH_ITEM_CREATION_SDCRITERIA_FORMID = "BATCH_ITEM_CREATION_SDCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_TMSCRITERIA_FORMID = "BATCH_ITEM_CREATION_TMSCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID = "BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID";

export interface BatchItemCreationSdCriteriaFormData {
    targetRedmineProject: string,
    sourceSoftDevProject: string,
    itemLevel: string,
    showCreated: boolean
};

export function getBatchItemCreationSdCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationSdCriteriaFormData> {
    return createFormGroupState<BatchItemCreationSdCriteriaFormData>(BATCH_ITEM_CREATION_SDCRITERIA_FORMID, {
        targetRedmineProject: '',
        sourceSoftDevProject: '',
        itemLevel: 'issue',
        showCreated: false
    });
}

export interface BatchItemCreationSdCriteriaSetupData {
    redmineProjectsFiltered: RedmineProject[];
    softDevProjectsFiltered: SoftDevProject[];
}

export function getBatchItemCreationSdCriteriaSetupDataInitialState(): BatchItemCreationSdCriteriaSetupData {
    return {
        redmineProjectsFiltered: [],
        softDevProjectsFiltered: []
    }
}

export interface BatchItemCreationTMSCriteriaFormData {
    targetRedmineProject: string,
    iTMSTask: string,
    showClosed: boolean,
    showCreated: boolean,
    showInClientBin: boolean
};

export function getBatchItemCreationTMSCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationTMSCriteriaFormData> {
    return createFormGroupState<BatchItemCreationTMSCriteriaFormData>(BATCH_ITEM_CREATION_TMSCRITERIA_FORMID, {
        targetRedmineProject: '',
        iTMSTask: '',
        showClosed: false,
        showCreated: false,
        showInClientBin: false
    });
}

export interface BatchItemCreationRedmineCriteriaFormData {
    targetRedmineProject: string,
    sourceRedmineProject: string,
    showCreated: boolean
};

export function getBatchItemCreationRedmineCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationRedmineCriteriaFormData> {
    return createFormGroupState<BatchItemCreationRedmineCriteriaFormData>(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID, {
        targetRedmineProject: '',
        sourceRedmineProject: '',
        showCreated: false
    });
}

export interface BatchItemCreationRecords {
    currentIndex: number;
    proposedItems: ProposedItem[];
}

export function getBatchItemCreationRecordsInitialState(): BatchItemCreationRecords {
    return {
        currentIndex: -1,
        proposedItems: []
    }
}

export interface BatchItemCreationFormData {
    skipCreationForm: boolean;
    deletedColumnsSelToAdd: string;
}

export const BATCH_ITEM_CREATION_FORMID = "BATCH_ITEM_CREATION_FORMID";

export function getBatchItemCreationFormDataInitialState(): FormGroupState<BatchItemCreationFormData> {
    return createFormGroupState<BatchItemCreationFormData>(BATCH_ITEM_CREATION_FORMID, {
        skipCreationForm: false,
        deletedColumnsSelToAdd: ''
    });
}

export interface BatchItemCreationFormDataAddon {
    displayedColumns: string[];
    deletedColumns: string[];
}

export const BATCH_ITEM_CREATION_FORM_ADDON_ID = "BATCH_ITEM_CREATION_FORM_ADDON_ID";

export function getBatchItemCreationFormDataAddonInitialState(): FormGroupState<BatchItemCreationFormDataAddon> {
    return createFormGroupState<BatchItemCreationFormDataAddon>(BATCH_ITEM_CREATION_FORM_ADDON_ID, {
        displayedColumns: ['SELECT', 'SUBJECT', 'ISSUE', 'CR', 'expand'],
        deletedColumns: []
    });
}

