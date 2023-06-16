import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemsReducerKey } from './../items.reducer';
import { State } from '../state/items.state';
import { getItemsState } from './items.common-selectors';

export const getBatchItemCreationSDCriteriaSearchFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaFormData);
export const getBatchItemCreationSdCriteriaFormState = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaFormData);

export const getRedmineProjectsFilteredForBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaSetupData.redmineProjectsFiltered);
export const getSoftDevProjectsFilteredForBatchItemCreation = createSelector(getItemsState, (state: State) => state.batchItemCreationSdCriteriaSetupData.softDevProjectsFiltered);
