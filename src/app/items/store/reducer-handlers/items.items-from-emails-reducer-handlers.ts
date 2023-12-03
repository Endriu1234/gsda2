import * as _ from 'lodash';

import { State } from "../state/items.state";
import { filterRedmineProjects, filterRedmineUsersGroup } from 'src/app/shared/store/shared.reducer-handlers';


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
