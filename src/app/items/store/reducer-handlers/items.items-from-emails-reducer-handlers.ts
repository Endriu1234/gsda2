import * as _ from 'lodash';

import { State } from "../state/items.state";
import { filterRedmineProjects, filterRedmineUsersGroup } from 'src/app/shared/store/shared.reducer-handlers';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { ItemsFromEmailsSettings } from '../models/itemsfromemails/items-from-emails-settings.model';


export function initItemsFromEmailsSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsGridSetup.dbStateLoaded = false;
    newState.itemsFromEmailsSettingsGridSetup.dbStateLoading = true;
    return newState;
}

export function endInitItemsFromEmailsSettings(state: State, args: { records: ItemsFromEmailsSettings[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsGridData.records = args.records;
    newState.itemsFromEmailsSettingsGridSetup.dbStateLoaded = true;
    newState.itemsFromEmailsSettingsGridSetup.dbStateLoading = false;
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


export function deleteItemsFromEmailsSetting(state: State, args: { settings: ItemsFromEmailsSettings }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsSettingsGridData.records = newState.itemsFromEmailsSettingsGridData.records
        .filter(s => !(s.name === args.settings.name && s.type === args.settings.type));

    return newState;
}

export function editItemsFromEmailsSetting(state: State, args: { settings: ItemsFromEmailsSettings }): State {
    const newState: State = _.cloneDeep(state);

    newState.itemsFromEmailsSettingsSetupData.editedSetting = args.settings;
    return newState;
}

export function addItemsFromEmailsSetting(state: State): State {
    const newState: State = _.cloneDeep(state);

    newState.itemsFromEmailsSettingsSetupData.editedSetting = null;
    return newState;
}

export function updateEditedItemsFromEmailsSetting(state: State, args: { originalSetting: ItemsFromEmailsSettings | null, currentSetting: ItemsFromEmailsSettings }): State {
    const newState: State = _.cloneDeep(state);

    if (args.originalSetting) {
        newState.itemsFromEmailsSettingsGridData.records = newState.itemsFromEmailsSettingsGridData.records
            .map(s => s.name === args.originalSetting!.name && s.type === args.originalSetting!.type ? args.currentSetting : s);
    }
    else {
        const newRecords = [...newState.itemsFromEmailsSettingsGridData.records];
        newRecords.unshift(args.currentSetting);
        newState.itemsFromEmailsSettingsGridData.records = newRecords;
    }

    newState.itemsFromEmailsSettingsSetupData.editedSetting = args.currentSetting;

    return newState;
}
