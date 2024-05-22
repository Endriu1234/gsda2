import { createFeatureSelector, createSelector } from '@ngrx/store';
import { setupReducerKey } from './../setup.reducer';
import { State } from '../state/setup.state';
import { CacheRefreshSetupData } from '../state/setup.cache-refresh-state';

export const getSetupState = createFeatureSelector<State>(setupReducerKey);
export const getCacheRefreshFormState = createSelector(getSetupState, (state: State) => state.cacheRefreshFormData);
export const getCacheRefreshSetupDataState = createSelector(getSetupState, (state: State) => state.cacheRefreshSetupData);

export const getItemCreationFormCanActivateSave = createSelector(getCacheRefreshSetupDataState, isCacheRefreshingInProgress);

function isCacheRefreshingInProgress(refreshCacheSetupState: CacheRefreshSetupData): boolean {
    return refreshCacheSetupState.refreshInProgress || refreshCacheSetupState.refreshCustomFieldsInProgress || refreshCacheSetupState.refreshEmailSettingsInProgress
        || refreshCacheSetupState.refreshRedmineProjectsInProgress || refreshCacheSetupState.refreshSDProjectsInProgress 
        || refreshCacheSetupState.refreshUserPreferencesInProgress || refreshCacheSetupState.refreshVersionsInProgress;
}