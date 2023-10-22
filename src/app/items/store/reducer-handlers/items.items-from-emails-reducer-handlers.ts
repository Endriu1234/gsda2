import * as _ from 'lodash';

import { State } from "../state/items.state";


export function initItemsFromEmailsGeneralSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsGeneralSettingsSetupData.dbStateLoaded = false;
    newState.itemsFromEmailsGeneralSettingsSetupData.dbStateLoading = true;
    return newState;
}

export function endInitItemsFromEmailsGeneralSettings(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsFromEmailsGeneralSettingsSetupData.dbStateLoaded = true;
    newState.itemsFromEmailsGeneralSettingsSetupData.dbStateLoading = false;
    return newState;
}
