import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineUser } from "../../../shared/store/models/redmine-user.model";
import { RedmineUserByLetter } from "../../../shared/store/models/redmine-user-letter-model";
import { CRValidation } from "../models/cr-validation.model";
import { IssueValidation } from "../models/issue-validation.model";
import { TmsValidation } from "../models/tms-validation.model";
import { FromIdValidation } from "../models/fromId-validation.model";
import { RedmineVersion } from "../../../shared/store/models/redmine-version.model";
import { UserPreferences } from "../models/itemcreation/userPreferences.model";

export enum ItemCreationMode {
    SingleItem = "SINGLE_ITEM_CREATION",
    BatchItemWithGUI = "BATCH_ITEM_CREATION_WITH_GUI",
    BatchItemWithoutGUI = "BATCH_ITEM_CREATION_WITHOUT_GUI",
    BatchItemSingleRecord = "BATCH_ITEM_SINGLE_RECORD"
}

export interface ItemCreationSetupData {
    resetInProgress: boolean,
    mode: ItemCreationMode,
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
    redmineVersionsLoaded: boolean;
    redmineVersions: RedmineVersion[];
    loadingUserPreferences: boolean;
    savingUserPreferences: boolean;
    refreshingVersions: boolean;
}

export function getItemCreationSetupDataInitialState(): ItemCreationSetupData {
    return {
        resetInProgress: false,
        mode: ItemCreationMode.SingleItem,
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineUsersByLetterLoaded: false,
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
        redmineProjectsFiltered: [],
        validatedCRs: [],
        validatedIssues: [],
        validatedTms: [],
        validatedFromId: [],
        redmineVersionsLoaded: false,
        redmineVersions: [],
        loadingUserPreferences: false,
        savingUserPreferences: false,
        refreshingVersions: false
    };
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
    version: string;
    est_time: string;
    files: File[]
}

export const ITEM_CREATION_FORMID = "ITEM_CREATION_FORMID";

export function getItemCreationFromDataInitialState(): FormGroupState<ItemCreationFromData> {
    return createFormGroupState<ItemCreationFromData>(ITEM_CREATION_FORMID, {
        project: '',
        tracker: '',
        subject: '',
        description: '',
        issue: '',
        user: '',
        cr: '',
        tms: '',
        version: '',
        est_time: '',
        files: []
    });
}

export interface ItemCreationFromIdDialog {
    fromId: string;
}

export const ITEM_CREATION_DIALOG = "ITEM_CREATION_DIALOG";

export function getItemCreationFromIdDialogInitialState(): FormGroupState<ItemCreationFromIdDialog> {
    return createFormGroupState<ItemCreationFromIdDialog>(ITEM_CREATION_DIALOG, {
        fromId: ''
    });
}

export interface ItemCreationUserPreferences {
    rememberProject: boolean;
    rememberVersion: boolean;
    rememberTracker: boolean;
    rememberUser: boolean;
}

export const ITEM_CREATION_USER_PREFERENCES_DIALOG = "ITEM_CREATION_USER_PREFERENCES_DIALOG";

export function getItemCreationUserPreferencesInitialState(): FormGroupState<ItemCreationUserPreferences> {
    return createFormGroupState<ItemCreationUserPreferences>(ITEM_CREATION_USER_PREFERENCES_DIALOG, {
        rememberProject: false,
        rememberVersion: false,
        rememberTracker: false,
        rememberUser: false
    });
}

export interface ItemCreationUserPreferencesSetupData  {
    userPreferences: UserPreferences;
}

export function getItemCreationUserPreferencesSetupDataInitialState(): ItemCreationUserPreferencesSetupData {
    return {
        userPreferences: {
            formId: '',
            user: '',
            setupValues: {
                rememberProject: false,
                rememberVersion: false,
                rememberTracker: false,
                rememberUser: false
            },
            currentValues: {
                project: '',
                version: '',
                tracker: '',
                user: ''
            }
        }
    };
}