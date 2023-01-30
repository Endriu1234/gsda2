import { State } from './items.state';


export function fun1(count: number): number {
    return 3;
}

export function loadRedmineTrackers(state: State, { redmineTrackers: RedmineTracker[] }): State {
    let newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineTrackers = redmineTrackers;
    newState.itemCreation.redmineTrackersLoaded = true;
    return newState;

}