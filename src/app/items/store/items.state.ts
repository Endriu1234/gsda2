import { RedmineProject } from "../../shared/store/models/redmine-project.model";
import { RedmineTracker } from "./models/redmine-tracker.model";
import { RedmineUser } from "./models/redmine-user.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { CRValidation } from "./models/cr-validation.model";
import { IssueValidation } from "./models/issue-validation.model";
import { TmsValidation } from "./models/tms-validation.model";
import { FromIdValidation } from "./models/fromId-validation.model";
import { RedmineUserByLetter } from "./models/redmine-user-letter-model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";

export interface ItemsSetupData {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    softDevProjectsLoaded: boolean;
    softDevProjects: SoftDevProject[];
}

export interface ItemCreationSetupData {
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineUsersByLetterLoaded: boolean;
    redmineUsersByLetter: RedmineUserByLetter[];
    redmineUsersByLetterFiltered: RedmineUserByLetter[];
    redmineProjectsFiltered: RedmineProject[];
    validatedCRs: CRValidation[];
    validatedIssues: IssueValidation[];
    validatedTms: TmsValidation[];
    validatedFromId: FromIdValidation[];
}

export interface ItemCreationFromData {
    project: string;
    tracker: string;
    subject: string;
    description: string;
    user: string;
    issue: string;
    cr: string;
    tms: string;
}

export interface ItemCreationFromIdDialog {
    fromId: string;
}

export interface BatchItemCreationSdCriteriaSetupData {
    redmineProjectsFiltered: RedmineProject[];
    softDevProjectsFiltered: SoftDevProject[];
}

export interface BatchItemCreationSdCriteriaFormData {
    targetRedmineProject: string,
    sourceSoftDevProject: string,
    itemLevel: string,
    showCreated: boolean
}

export interface State {
    itemsSetupData: ItemsSetupData;
    itemCreationSetupData: ItemCreationSetupData;
    batchItemCreationSdCriteriaSetupData: BatchItemCreationSdCriteriaSetupData;
    itemCreationFromData: FormGroupState<ItemCreationFromData>;
    itemCreationFromIdDialog: FormGroupState<ItemCreationFromIdDialog>;
    batchItemCreationSdCriteriaFormData: FormGroupState<BatchItemCreationSdCriteriaFormData>;
}

export const ITEM_CREATION_FORMID = "ITEM_CREATION_FORMID";
export const ITEM_CREATION_DIALOG = "ITEM_CREATION_DIALOG";
export const BATCH_ITEM_CREATION_SDCRITERIA_FORMID = "BATCH_ITEM_CREATION_SDCRITERIA_FORMID";

export const initialState: State = {
    itemsSetupData: {
        redmineProjectsLoaded: false,
        redmineProjects: [],
        softDevProjectsLoaded: false,
        softDevProjects: []
    },
    itemCreationSetupData: {
        redmineTrackersLoaded: false,
        redmineTrackers: [],
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineUsersByLetterLoaded: false,
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
        redmineProjectsFiltered: [],
        validatedCRs: [],
        validatedIssues: [],
        validatedTms: [],
        validatedFromId: []
    },
    batchItemCreationSdCriteriaSetupData: {
        redmineProjectsFiltered: [],
        softDevProjectsFiltered: []
    },
    itemCreationFromData: createFormGroupState<ItemCreationFromData>(ITEM_CREATION_FORMID, {
        project: '',
        tracker: '',
        subject: '',
        description: '',
        issue: '',
        user: '',
        cr: '',
        tms: ''
    }),
    itemCreationFromIdDialog: createFormGroupState<ItemCreationFromIdDialog>(ITEM_CREATION_DIALOG, {
        fromId: ''
    }),
    batchItemCreationSdCriteriaFormData: createFormGroupState<BatchItemCreationSdCriteriaFormData>(BATCH_ITEM_CREATION_SDCRITERIA_FORMID, {
        targetRedmineProject: '',
        sourceSoftDevProject: '',
        itemLevel: '',
        showCreated: false
    }),
}