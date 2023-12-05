import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { RedmineUserByLetter } from "src/app/shared/store/models/redmine-user-letter-model";
import { RedmineUser } from "src/app/shared/store/models/redmine-user.model";

export interface ItemsFromEmailsSettingsFormData {
    active: boolean;
    tracker: string;
    project: string;
    version: string,
    user: string;
    parsingMode: string,
    addAttachments: boolean,
    modifiedBy: string
}

export const ITEMS_FROM_EMAILS_SETTINGS_FORMID = "ITEMS_FROM_EMAILS_SETTINGS_FORMID";

export function getItemsFromEmailsSettingsFormDataInitialState(): FormGroupState<ItemsFromEmailsSettingsFormData> {
    return createFormGroupState<ItemsFromEmailsSettingsFormData>(ITEMS_FROM_EMAILS_SETTINGS_FORMID, {
        active: false,
        tracker: '',
        project: '',
        version: '',
        user: '',
        parsingMode: '',
        addAttachments: false,
        modifiedBy: ''
    });
}

export interface ItemsFromEmailsSettingsSetupData {
    dbStateLoaded: boolean;
    dbStateLoading: boolean;
    redmineProjectsFiltered: RedmineProject[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineUsersByLetterLoaded: boolean;
    redmineUsersByLetter: RedmineUserByLetter[];
    redmineUsersByLetterFiltered: RedmineUserByLetter[];
}

export function getItemsFromEmailsSettingsSetupDataInitialState(): ItemsFromEmailsSettingsSetupData {
    return {
        dbStateLoaded: false,
        dbStateLoading: false,
        redmineProjectsFiltered: [],
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineUsersByLetterLoaded: false,
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
    };
}