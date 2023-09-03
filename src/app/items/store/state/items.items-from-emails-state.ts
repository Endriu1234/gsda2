import { createFormGroupState, FormGroupState } from "ngrx-forms";

export interface ItemsFromEmailsGeneralSettingsFormData {
    enabled: boolean;
    interval: number;
}

export const ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID = "ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID";

export function getItemsFromEmailsGeneralSettingsFormDataInitialState(): FormGroupState<ItemsFromEmailsGeneralSettingsFormData> {
    return createFormGroupState<ItemsFromEmailsGeneralSettingsFormData>(ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID, {
        enabled: false,
        interval: 5
    });
}