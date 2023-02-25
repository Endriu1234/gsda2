import { createReducer, on, combineReducers } from '@ngrx/store';
import { initRedmineTrackers, loadRedmineTrackers, initRedmineUsers, loadRedmineUsers, initRedmineProjects, loadRedmineProjects, setRedmineUsersFilter, setRedmineProjectsFilter, addValidatedCR } from './items.actions';
import { initialState, ItemCreationFromData, State } from './items.state';
import * as fromReducerHanders from './items.reducer-handlers';
import { onNgrxForms, wrapReducerWithFormStateUpdate, updateGroup, validate, ValidationErrors } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

export const itemsReducerKey = 'items';

const validationReducer = updateGroup<ItemCreationFromData>({
    tracker: validate(required),
    subject: validate(required),
    description: validate(required),
    // user: (state, parentState) => {
    //     //     // return disable(state);
    //     //return validate(required);
    //     //     // return updateGroup<ItemCreationFromData['user']>(state, { user: setValue('1') });
    //     state = validate(state, validateUser);
    //     return state;
    // }
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(initRedmineTrackers, fromReducerHanders.initRedmineTrackers),
    on(loadRedmineTrackers, fromReducerHanders.loadRedmineTrackers),
    on(initRedmineUsers, fromReducerHanders.initRedmineUsers),
    on(loadRedmineUsers, fromReducerHanders.loadRedmineUsers),
    on(initRedmineProjects, fromReducerHanders.initRedmineProjects),
    on(loadRedmineProjects, fromReducerHanders.loadRedmineProjects),
    on(setRedmineUsersFilter, fromReducerHanders.setRedmineUsersFilter),
    on(setRedmineProjectsFilter, fromReducerHanders.setRedmineProjectsFilter),
    on(addValidatedCR, fromReducerHanders.addValidatedCR));

export const itemsReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.itemCreationFromData;
    },
    validationReducer
);

