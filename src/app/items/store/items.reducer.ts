import { createReducer, on } from '@ngrx/store';
import { initRedmineTrackers, loadRedmineTrackers, initRedmineUsers, loadRedmineUsers } from './items.actions';
import * as _ from 'lodash';
import { initialState, State } from './items.state';

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
    }),
    on(initRedmineUsers, (state) => {
        return {
            ...state, redmineUsersLoaded: false
        }
    }),
    on(loadRedmineUsers, (state, { redmineUsers }) => {
        let newState: State = _.cloneDeep(state);
        newState.itemCreation.redmineUsers = redmineUsers;
        newState.itemCreation.redmineUsersLoaded = true;
        return newState;
    }));


