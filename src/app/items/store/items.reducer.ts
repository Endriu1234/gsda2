import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { initRedmineTrackers, loadRedmineTrackers } from './items.actions';
import * as _ from 'lodash';
import { RedmineTracker } from './models/redmine-tracker.model';


export interface ItemCreation {
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
}

export interface State {

    itemCreation: ItemCreation;
}

const initialState: State = {
    itemCreation: {
        redmineTrackersLoaded: false,
        redmineTrackers: []
    }
}

export const itemsReducerKey = 'items';

export const itemsReducer = createReducer(initialState,
    on(initRedmineTrackers, (state) => {
        return {
            ...state, redmineTrackersLoaded: false
        }
    }),
    on(loadRedmineTrackers, (state, { redmineTrackers }) => {
        let newState: State = _.cloneDeep(state);
        newState.itemCreation.redmineTrackers = redmineTrackers;
        newState.itemCreation.redmineTrackersLoaded = true;
        return newState;
    }));


export const getItemsState = createFeatureSelector<State>(itemsReducerKey);
export const getRedmineTrackers = createSelector(getItemsState, (state: State) => state.itemCreation.redmineTrackers);
export const getRedmineTrackersLoaded = createSelector(getItemsState, (state: State) => state.itemCreation.redmineTrackersLoaded);
