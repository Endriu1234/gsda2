import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";
import { ProposedItem } from "../models/batchitemcreation/proposed-item.model";
import { box, Boxed, createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineUserByLetter } from "../../../shared/store/models/redmine-user-letter-model";
import { TmsClient } from "src/app/shared/store/models/tms-client.model";
import { TmsClientByLetter } from "src/app/shared/store/models/tms-client-letter.model";

export const BATCH_ITEM_CREATION_SDCRITERIA_FORMID = "BATCH_ITEM_CREATION_SDCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_TMSCRITERIA_FORMID = "BATCH_ITEM_CREATION_TMSCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID = "BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID";
export const BATCH_ITEM_CREATION_IDSCRITERIA_FORMID = "BATCH_ITEM_CREATION_IDSCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS = ['TRACKER', 'SUBJECT', 'ISSUE', 'CR', 'TMS'];

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

export interface BatchItemCreationTmsCriteriaSetupData {
    redmineTargetProjectsFiltered: RedmineProject[];
    redmineUsersByLetter: RedmineUserByLetter[];
    redmineUsersByLetterFiltered: RedmineUserByLetter[];
    tmsClients: TmsClient[];
    tmsClientsByLetter: TmsClientByLetter[];
    tmsClientsByLetterFiltered: TmsClientByLetter[];
    tmsClientsLoaded: boolean;
}

export function getBatchItemCreationTmsCriteriaSetupDataInitialState(): BatchItemCreationTmsCriteriaSetupData {
    return {
        redmineTargetProjectsFiltered: [],
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
        tmsClients: [],
        tmsClientsByLetter: [],
        tmsClientsByLetterFiltered: [],
        tmsClientsLoaded: false
    }
}

export interface BatchItemCreationTMSCriteriaFormData {
    targetRedmineProject: string,
    iTMSClient: string,
    showClosed: boolean,
    showCreated: boolean,
    showInClientBin: boolean,
    fromDate: string,
    toDate: string,
    userToITms: string
};

export function getBatchItemCreationTMSCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationTMSCriteriaFormData> {
    return createFormGroupState<BatchItemCreationTMSCriteriaFormData>(BATCH_ITEM_CREATION_TMSCRITERIA_FORMID, {
        targetRedmineProject: '',
        iTMSClient: '',
        showClosed: false,
        showCreated: false,
        showInClientBin: false,
        fromDate: '',
        toDate: '',
        userToITms: ''
    });
}

export interface BatchItemCreationRedmineCriteriaSetupData {
    redmineSourceProjectsFiltered: RedmineProject[];
    redmineTargetProjectsFiltered: RedmineProject[];
}

export function getBatchItemCreationRedmineCriteriaSetupDataInitialState(): BatchItemCreationRedmineCriteriaSetupData {
    return {
        redmineSourceProjectsFiltered: [],
        redmineTargetProjectsFiltered: []
    }
}

export interface BatchItemCreationRedmineCriteriaFormData {
    targetRedmineProject: string,
    sourceRedmineProject: string,
    showCreated: boolean,
    showClosed: boolean
};

export function getBatchItemCreationRedmineCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationRedmineCriteriaFormData> {
    return createFormGroupState<BatchItemCreationRedmineCriteriaFormData>(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID, {
        targetRedmineProject: '',
        sourceRedmineProject: '',
        showCreated: false,
        showClosed: false
    });
}

export interface BatchItemCreationIdsCriteriaSetupData {
    redmineTargetProjectsFiltered: RedmineProject[];
}

export function getBatchItemCreationIdsCriteriaSetupDataInitialState(): BatchItemCreationIdsCriteriaSetupData {
    return {
        redmineTargetProjectsFiltered: []
    }
}

export interface BatchItemCreationIdsCriteriaFormData {
    targetRedmineProject: string,
    showCreated: boolean,
    allIds: string
};

export function getBatchItemCreationIdsCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationIdsCriteriaFormData> {
    return createFormGroupState<BatchItemCreationIdsCriteriaFormData>(BATCH_ITEM_CREATION_IDSCRITERIA_FORMID, {
        targetRedmineProject: '',
        showCreated: false,
        allIds: ''
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
    visibleColumns: Boxed<string[]>;
}

export const BATCH_ITEM_CREATION_FORMID = "BATCH_ITEM_CREATION_FORMID";

export function getBatchItemCreationFormDataInitialState(): FormGroupState<BatchItemCreationFormData> {
    return createFormGroupState<BatchItemCreationFormData>(BATCH_ITEM_CREATION_FORMID, {
        skipCreationForm: false,
        visibleColumns: box(BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS)
    });
}

export interface BatchItemCreationFormDataAddon {
    displayedColumns: string[];
    deletedColumns: string[];
}

export const BATCH_ITEM_CREATION_FORM_ADDON_ID = "BATCH_ITEM_CREATION_FORM_ADDON_ID";

export function getBatchItemCreationFormDataAddonInitialState(): FormGroupState<BatchItemCreationFormDataAddon> {
    return createFormGroupState<BatchItemCreationFormDataAddon>(BATCH_ITEM_CREATION_FORM_ADDON_ID, {
        displayedColumns: ['SELECT', 'TRACKER', 'SUBJECT', 'ISSUE', 'CR', 'TMS', 'LINK', 'expand'],
        deletedColumns: []
    });
}

