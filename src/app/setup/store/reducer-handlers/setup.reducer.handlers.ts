import * as _ from 'lodash';
import { State } from '../state/setup.state';

export function refreshCache(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshInProgress = true;
    return newState;
}

export function endRefreshCache(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.cacheRefreshSetupData.refreshInProgress = false;
    return newState;
}