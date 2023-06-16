import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";
import { ProposedItem } from "../models/batchitemcreation/proposed-item.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";

export const BATCH_ITEM_CREATION_SDCRITERIA_FORMID = "BATCH_ITEM_CREATION_SDCRITERIA_FORMID";

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
        itemLevel: '',
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
