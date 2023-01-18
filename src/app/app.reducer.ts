import { ActionReducerMap } from '@ngrx/store';
import * as fromNavigation from './navigation/store/navigation.reducer';
import * as fromItems from './items/store/items.reducer';

export interface State {
    [fromNavigation.navigationReducerKey]: fromNavigation.State,
    [fromItems.itemsReducerKey]: fromItems.State
}

export const reducers: ActionReducerMap<State> = {
    [fromNavigation.navigationReducerKey]: fromNavigation.navigationReducer,
    [fromItems.itemsReducerKey]: fromItems.itemsReducer
};


