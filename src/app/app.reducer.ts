import { ActionReducerMap } from '@ngrx/store';
import * as fromNavigation from './navigation/store/navigation.reducer';
import * as fromItems from './items/store/items.reducer';
import * as fromItemsState from './items/store/state/items.state';
import * as fromProjects from './projects/store/projects.reducer';
import * as fromProjectsState from './projects/store/state/projects.state';
import * as fromShared from './shared/store/shared.reducer';
import * as fromSharedState from './shared/store/shared.state';
import * as fromAuthState from './auth/store/auth.state';
import * as fromAuth from './auth/store/auth.reducer';
import * as fromSetup from './setup/store/setup.reducer'
import * as fromSetupState from './setup/store/state/setup.state';

export interface State {
    [fromNavigation.navigationReducerKey]: fromNavigation.State,
    [fromItems.itemsReducerKey]: fromItemsState.State,
    [fromProjects.projectsReducerKey]: fromProjectsState.State,
    [fromShared.sharedReducerKey]: fromSharedState.State,
    [fromAuth.authReducerKey]: fromAuthState.State,
    [fromSetup.setupReducerKey]: fromSetupState.State
}

export const reducers: ActionReducerMap<State> = {
    [fromNavigation.navigationReducerKey]: fromNavigation.navigationReducer,
    [fromItems.itemsReducerKey]: fromItems.itemsReducer,
    [fromProjects.projectsReducerKey]: fromProjects.projectsReducer,
    [fromShared.sharedReducerKey]: fromShared.sharedReducer,
    [fromAuth.authReducerKey]: fromAuth.authReducer,
    [fromSetup.setupReducerKey]: fromSetup.setupReducer
};


