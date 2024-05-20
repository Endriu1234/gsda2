import * as _ from 'lodash';
import { State } from '../state/setup.state';

export function refreshCache(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshInProgress = true;
    return newState;
}

export function endRefreshCache(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshInProgress = false;
    return newState;
}

export function refreshVersions(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshVersionsInProgress = true;
    return newState;
}

export function endRefreshVersions(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshVersionsInProgress = false;
    return newState;
}

export function refreshSDProjects(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshSDProjectsInProgress = true;
    return newState;
}

export function endRefreshSDProjects(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshSDProjectsInProgress = false;
    return newState;
}

export function refreshRedmineProjects(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshRedmineProjectsInProgress = true;
    return newState;
}

export function endRefreshRedmineProjects(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshRedmineProjectsInProgress = false;
    return newState;
}

export function refreshCustomFields(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshCustomFieldsInProgress = true;
    return newState;
}

export function endRefreshCustomFields(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshCustomFieldsInProgress = false;
    return newState;
}

export function refreshEmailSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshEmailSettingsInProgress = true;
    return newState;
}

export function endRefreshEmailSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshEmailSettingsInProgress = false;
    return newState;
}

export function refreshUserPreferences(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshUserPreferencesInProgress = true;
    return newState;
}

export function endRefreshUserPreferences(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshUserPreferencesInProgress = false;
    return newState;
}