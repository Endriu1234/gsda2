import { getItemsState } from './items.common-selectors';
import { State } from '../state/items.state';
import { createSelector } from '@ngrx/store';

export const getItemsFromEmailsSettingsFormData = createSelector(getItemsState, (state: State) => state.itemsFromEmailsSettingsFormData);
export const getRedmineProjectsFilteredForItemsFromEmail = createSelector(getItemsState, (state: State) => state.itemsFromEmailsSettingsSetupData.redmineProjectsFiltered);

