import { getItemsState } from './items.common-selectors';
import { State } from '../state/items.state';
import { createSelector } from '@ngrx/store';

export const getItemsFromEmailsSettingsFormData = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsFormData);

export const getRedmineProjectsFilteredForItemsFromEmail = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsSetupData.redmineProjectsFiltered);

//export const getRedmineUsersByLetter = createSelector(getItemsState,
//    (state: State) => state.itemCreationSetupData.redmineUsersByLetter);

export const getRedmineUsersByLetterFiltered = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsSetupData.redmineUsersByLetterFiltered);

//export const getRedmineUsersByLetterLoaded = createSelector(getItemsState,
//   (state: State) => state.itemCreationSetupData.redmineUsersByLetterLoaded);