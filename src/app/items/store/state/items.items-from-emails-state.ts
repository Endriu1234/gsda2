import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { RedmineUserByLetter } from "src/app/shared/store/models/redmine-user-letter-model";
import { RedmineUser } from "src/app/shared/store/models/redmine-user.model";
import { RedmineVersion } from "src/app/shared/store/models/redmine-version.model";
import { ItemsFromEmailsSettings } from "../models/itemsfromemails/items-from-emails-settings.model";

export interface ItemsFromEmailsSettingsFormData {
    name: string;
    active: boolean;
    type: string;
    tracker: string;
    project: string;
    version: string,
    user: string;
    parsingMode: string,
    findIssues: string,
    findCRs: string,
    addAttachments: boolean,
    closeItemsAfterAttach: string,
    sendAttachResultTo: string,
    modifiedBy: string
}

export const ITEMS_FROM_EMAILS_SETTINGS_FORMID = "ITEMS_FROM_EMAILS_SETTINGS_FORMID";

export function getItemsFromEmailsSettingsFormDataInitialState(): FormGroupState<ItemsFromEmailsSettingsFormData> {
    return createFormGroupState<ItemsFromEmailsSettingsFormData>(ITEMS_FROM_EMAILS_SETTINGS_FORMID, {
        name: '',
        active: false,
        type: '',
        tracker: '',
        project: '',
        version: '',
        user: '',
        parsingMode: '',
        findIssues: '',
        findCRs: '',
        addAttachments: false,
        closeItemsAfterAttach: '',
        sendAttachResultTo: '',
        modifiedBy: ''
    });
}

export interface ItemsFromEmailsSettingsSetupData {
    redmineProjectsFiltered: RedmineProject[];
    redmineVersionsLoaded: boolean;
    redmineVersions: RedmineVersion[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineUsersByLetterLoaded: boolean;
    redmineUsersByLetter: RedmineUserByLetter[];
    redmineUsersByLetterFiltered: RedmineUserByLetter[];
}

export function getItemsFromEmailsSettingsSetupDataInitialState(): ItemsFromEmailsSettingsSetupData {
    return {
        redmineProjectsFiltered: [],
        redmineVersionsLoaded: false,
        redmineVersions: [],
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineUsersByLetterLoaded: false,
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
    };
}

export interface ItemsFromEmailsSettingsGridData {
    currentIndex: number;
    records: ItemsFromEmailsSettings[];
}

export function getItemsFromEmailsSettingsGridDataInitialState(): ItemsFromEmailsSettingsGridData {
    return {
        currentIndex: -1,
        records: []
    }
}

export interface ItemsFromEmailsSettingsGridSetup {
    dbStateLoaded: boolean;
    dbStateLoading: boolean;
    displayedColumns: string[];
}

export function getItemsFromEmailsSettingsGridSetupInitialState(): ItemsFromEmailsSettingsGridSetup {
    return {
        dbStateLoaded: false,
        dbStateLoading: false,
        displayedColumns: ['name', 'active', 'type', 'project', 'version', 'tracker', 'expand', 'edit', 'delete']
    };
}
