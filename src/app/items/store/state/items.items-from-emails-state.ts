import { createFormGroupState, FormGroupState } from "ngrx-forms";

export interface ItemsFromEmailsSettingsFormData {
    enabled: boolean;
    interval: number;
}

export const ITEMS_FROM_EMAILS_SETTINGS_FORMID = "ITEMS_FROM_EMAILS_SETTINGS_FORMID";

export function getItemsFromEmailsSettingsFormDataInitialState(): FormGroupState<ItemsFromEmailsSettingsFormData> {
    return createFormGroupState<ItemsFromEmailsSettingsFormData>(ITEMS_FROM_EMAILS_SETTINGS_FORMID, {
        enabled: false,
        interval: 5
    });
}

export interface ItemsFromEmailsSettingsSetupData {
    dbStateLoaded: boolean;
    dbStateLoading: boolean;
}

export function getItemsFromEmailsSettingsSetupDataInitialState(): ItemsFromEmailsSettingsSetupData {
    return {
        dbStateLoaded: false,
        dbStateLoading: false
    };
}