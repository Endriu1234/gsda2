import { FormGroupState, createFormGroupState } from "ngrx-forms";

export interface CacheRefreshSetupData {
    refreshInProgress: boolean
}

export function getCacheRefreshSetupDataInitialState(): CacheRefreshSetupData {
    return {
        refreshInProgress: false
    };
}

export interface CacheRefreshFromData {
}

export const CACHE_REFRESH_FORMID = "CACHE_REFRESH_FORMID";

export function getCacheRefreshFromDataInitialState(): FormGroupState<CacheRefreshFromData> {
    return createFormGroupState<CacheRefreshFromData>(CACHE_REFRESH_FORMID, {
    });
}