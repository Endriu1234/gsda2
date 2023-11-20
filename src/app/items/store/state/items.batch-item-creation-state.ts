import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";
import { ProposedItem } from "../models/batchitemcreation/proposed-item.model";
import { box, Boxed, createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineUserByLetter } from "../../../shared/store/models/redmine-user-letter-model";
import { TmsClient } from "src/app/shared/store/models/tms-client.model";
import { TmsClientByLetter } from "src/app/shared/store/models/tms-client-letter.model";
import { RedmineVersion } from "../../../shared/store/models/redmine-version.model";

export const BATCH_ITEM_CREATION_SDCRITERIA_FORMID = "BATCH_ITEM_CREATION_SDCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_TMSCRITERIA_FORMID = "BATCH_ITEM_CREATION_TMSCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID = "BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID";
export const BATCH_ITEM_CREATION_IDSCRITERIA_FORMID = "BATCH_ITEM_CREATION_IDSCRITERIA_FORMID";
export const BATCH_ITEM_CREATION_GRID_REMOVABLE_COLUMNS = ['TRACKER', 'SUBJECT', 'ISSUE', 'CR', 'TMS'];

export interface BatchItemCreationSdCriteriaFormData {
    targetRedmineProject: string,
    sourceSoftDevProject: string,
    itemLevel: string,
    showCreated: boolean,
    version: string
};

export function getBatchItemCreationSdCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationSdCriteriaFormData> {
    return createFormGroupState<BatchItemCreationSdCriteriaFormData>(BATCH_ITEM_CREATION_SDCRITERIA_FORMID, {
        targetRedmineProject: '',
        sourceSoftDevProject: '',
        itemLevel: 'issue',
        showCreated: false,
        version: ''
    });
}

export interface BatchItemCreationSdCriteriaSetupData {
    redmineProjectsFiltered: RedmineProject[];
    softDevProjectsFiltered: SoftDevProject[];
    redmineVersionsLoaded: boolean;
    redmineVersions: RedmineVersion[];
}

export function getBatchItemCreationSdCriteriaSetupDataInitialState(): BatchItemCreationSdCriteriaSetupData {
    return {
        redmineProjectsFiltered: [],
        softDevProjectsFiltered: [],
        redmineVersionsLoaded: false,
        redmineVersions: []
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
    redmineVersionsLoaded: boolean;
    redmineVersions: RedmineVersion[];
}

export function getBatchItemCreationTmsCriteriaSetupDataInitialState(): BatchItemCreationTmsCriteriaSetupData {
    return {
        redmineTargetProjectsFiltered: [],
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
        tmsClients: [],
        tmsClientsByLetter: [],
        tmsClientsByLetterFiltered: [],
        tmsClientsLoaded: false,
        redmineVersionsLoaded: false,
        redmineVersions: []
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
    userToITms: string,
    version: string
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
        userToITms: '',
        version: ''
    });
}

export interface BatchItemCreationRedmineCriteriaSetupData {
    redmineSourceProjectsFiltered: RedmineProject[];
    redmineTargetProjectsFiltered: RedmineProject[];
    redmineVersionsLoaded: boolean;
    redmineVersions: RedmineVersion[];
}

export function getBatchItemCreationRedmineCriteriaSetupDataInitialState(): BatchItemCreationRedmineCriteriaSetupData {
    return {
        redmineSourceProjectsFiltered: [],
        redmineTargetProjectsFiltered: [],
        redmineVersionsLoaded: false,
        redmineVersions: []
    }
}

export interface BatchItemCreationRedmineCriteriaFormData {
    targetRedmineProject: string,
    sourceRedmineProject: string,
    showCreated: boolean,
    showClosed: boolean,
    version: string
};

export function getBatchItemCreationRedmineCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationRedmineCriteriaFormData> {
    return createFormGroupState<BatchItemCreationRedmineCriteriaFormData>(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID, {
        targetRedmineProject: '',
        sourceRedmineProject: '',
        showCreated: false,
        showClosed: false,
        version: ''
    });
}

export interface BatchItemCreationIdsCriteriaSetupData {
    redmineTargetProjectsFiltered: RedmineProject[];
    redmineVersionsLoaded: boolean;
    redmineVersions: RedmineVersion[];
}

export function getBatchItemCreationIdsCriteriaSetupDataInitialState(): BatchItemCreationIdsCriteriaSetupData {
    return {
        redmineTargetProjectsFiltered: [],
        redmineVersionsLoaded: false,
        redmineVersions: []
    }
}

export interface BatchItemCreationIdsCriteriaFormData {
    targetRedmineProject: string,
    showCreated: boolean,
    allIds: string,
    version: string
};

export function getBatchItemCreationIdsCriteriaFormDataInitialState(): FormGroupState<BatchItemCreationIdsCriteriaFormData> {
    return createFormGroupState<BatchItemCreationIdsCriteriaFormData>(BATCH_ITEM_CREATION_IDSCRITERIA_FORMID, {
        targetRedmineProject: '',
        showCreated: false,
        allIds: '',
        version: ''
    });
}

export interface BatchItemCreation {
    activated_tab: number;
    selected_tab: number;
}

export function getBatchItemCreationnitialState(): BatchItemCreation {
    return {
        activated_tab: 0,
        selected_tab: 0
    }
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

