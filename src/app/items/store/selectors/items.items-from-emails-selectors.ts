import { getItemsState } from './items.common-selectors';
import { State } from '../state/items.state';
import { createSelector } from '@ngrx/store';
import { ItemsFromEmailsSettingsFormData } from '../state/items.items-from-emails-state';
import { FormGroupState } from 'ngrx-forms';

export const getItemsFromEmailsSettingsFormData = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsFormData);

export const getRedmineProjectsFilteredForItemsFromEmail = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsSetupData.redmineProjectsFiltered);

export const getRedmineVersionsByProject = createSelector(getItemsState, (state: State) => state.itemsFromEmailsSettingsSetupData.redmineVersions);

export const getRedmineUsersByLetterFiltered = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsSetupData.redmineUsersByLetterFiltered);


export const getItemsFromEmailsSettingsCanActivateSave = createSelector(getItemsFromEmailsSettingsFormData, canItemsFromEmailsSettingsFormBeSaved);


function canItemsFromEmailsSettingsFormBeSaved(formState: FormGroupState<ItemsFromEmailsSettingsFormData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid) {
        return false;
    }

    return true;
}

export const getItemsFromEmailsSettingsColumns = createSelector(getItemsState,
    (state: State) => state.itemsFromEmailsSettingsGridSetup.displayedColumns);


export const getItemsFromEmailsSettingsGridData = createSelector(getItemsState, (state: State) => state.itemsFromEmailsSettingsGridData);

export const getItemsFromEmailsSettingsGridColumnsLength = createSelector(getItemsState, (state: State) => state.itemsFromEmailsSettingsGridSetup.displayedColumns.length);

