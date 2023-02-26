import { ActionReducerMap } from '@ngrx/store';
import * as fromNavigation from './navigation/store/navigation.reducer';
import * as fromItems from './items/store/items.reducer';
import * as fromItemsState from './items/store/items.state';
import * as fromProjects from './projects/store/projects.reducer';
import * as fromProjectsState from './projects/store/projects.state';

export interface State {
    [fromNavigation.navigationReducerKey]: fromNavigation.State,
    [fromItems.itemsReducerKey]: fromItemsState.State,
    [fromProjects.projectsReducerKey]: fromProjectsState.State
}

export const reducers: ActionReducerMap<State> = {
    [fromNavigation.navigationReducerKey]: fromNavigation.navigationReducer,
    [fromItems.itemsReducerKey]: fromItems.itemsReducer,
    [fromProjects.projectsReducerKey]: fromProjects.projectsReducer
};


