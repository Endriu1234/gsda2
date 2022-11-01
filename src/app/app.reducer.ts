import { ActionReducerMap } from '@ngrx/store';
import * as fromNavigation from './navigation/store/navigation.reducer';

export interface State {
    [fromNavigation.navigationReducerKey]: fromNavigation.State
}

export const reducers: ActionReducerMap<State> = {
    [fromNavigation.navigationReducerKey]: fromNavigation.navigationReducer
};


