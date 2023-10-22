import * as _ from 'lodash';

import { State } from "../state/items.state";


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
