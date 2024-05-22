import { FormGroupState, createFormGroupState } from "ngrx-forms";

export interface CacheRefreshSetupData {
    refreshInProgress: boolean;
    refreshVersionsInProgress: boolean;
    refreshSDProjectsInProgress: boolean;
    refreshRedmineProjectsInProgress: boolean;
    refreshCustomFieldsInProgress: boolean;
    refreshEmailSettingsInProgress: boolean;
    refreshUserPreferencesInProgress: boolean;
}

export function getCacheRefreshSetupDataInitialState(): CacheRefreshSetupData {
    return {
        refreshInProgress: false,
        refreshVersionsInProgress: false,
        refreshSDProjectsInProgress: false,
        refreshRedmineProjectsInProgress: false,
        refreshCustomFieldsInProgress: false,
        refreshEmailSettingsInProgress: false,
        refreshUserPreferencesInProgress: false
    };
}

export interface CacheRefreshFromData {
}

export const CACHE_REFRESH_FORMID = "CACHE_REFRESH_FORMID";

export function getCacheRefreshFromDataInitialState(): FormGroupState<CacheRefreshFromData> {
    return createFormGroupState<CacheRefreshFromData>(CACHE_REFRESH_FORMID, {
    });
}