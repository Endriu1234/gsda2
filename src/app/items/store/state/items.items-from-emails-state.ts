import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";

export interface ItemsFromEmailsSettingsFormData {
    enabled: boolean;
    tracker: string;
    project: string;
}

export const ITEMS_FROM_EMAILS_SETTINGS_FORMID = "ITEMS_FROM_EMAILS_SETTINGS_FORMID";

export function getItemsFromEmailsSettingsFormDataInitialState(): FormGroupState<ItemsFromEmailsSettingsFormData> {
    return createFormGroupState<ItemsFromEmailsSettingsFormData>(ITEMS_FROM_EMAILS_SETTINGS_FORMID, {
        enabled: false,
        tracker: '',
        project: ''
    });
}

export interface ItemsFromEmailsSettingsSetupData {
    dbStateLoaded: boolean;
    dbStateLoading: boolean;
    redmineProjectsFiltered: RedmineProject[];
}

export function getItemsFromEmailsSettingsSetupDataInitialState(): ItemsFromEmailsSettingsSetupData {
    return {
        dbStateLoaded: false,
        dbStateLoading: false,
        redmineProjectsFiltered: []
    };
}