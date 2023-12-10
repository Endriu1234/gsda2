import * as _ from 'lodash';

import { State } from "../state/items.state";
import { filterRedmineProjects, filterRedmineUsersGroup } from 'src/app/shared/store/shared.reducer-handlers';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';


export function initItemsFromEmailsSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.dbStateLoaded = false;
    newState.itemsFromEmailsSettingsSetupData.dbStateLoading = true;
    return newState;
}

export function endInitItemsFromEmailsSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.dbStateLoaded = true;
    newState.itemsFromEmailsSettingsSetupData.dbStateLoading = false;
    return newState;
}

export function setRedmineProjectsFilterForItemCreation(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.redmineProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.itemsFromEmailsSettingsFormData.value.project);
    return newState;
}

export function setRedmineUsersByLetterFilterForItemCreation(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.redmineUsersByLetterFiltered = filterRedmineUsersGroup(newState.itemsFromEmailsSettingsSetupData.redmineUsersByLetter, newState.itemsFromEmailsSettingsFormData.value.user);
    return newState;
}

export function initRedmineVersions(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersions(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.redmineVersions = args.redmineVersions;
    newState.itemsFromEmailsSettingsSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersions(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsSetupData.redmineVersions = [];
    newState.itemsFromEmailsSettingsSetupData.redmineVersionsLoaded = false;
    return newState;
}
