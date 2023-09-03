import { getItemsState } from './items.common-selectors';
import { State } from '../state/items.state';
import { createSelector } from '@ngrx/store';

export const getItemsFromEmailsGeneralSettingsFormData = createSelector(getItemsState, (state: State) => state.itemsFromEmailsGeneralSettingsFormData);
