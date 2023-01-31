import { State } from './items.state';
import * as _ from 'lodash';
import { RedmineTracker } from './models/redmine-tracker.model';
import { RedmineUser } from './models/redmine-user.model';
import { RedmineProject } from './models/redmine-project.model';

export function initRedmineTrackers(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreation.redmineTrackersLoaded = false;
    return newState;
}

export function loadRedmineTrackers(state: State, args: { redmineTrackers: RedmineTracker[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineTrackers = args.redmineTrackers;
    newState.itemCreation.redmineTrackersLoaded = true;
    return newState;

}

export function initRedmineUsers(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreation.redmineUsersLoaded = false;
    return newState;
}

export function loadRedmineUsers(state: State, args: { redmineUsers: RedmineUser[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineUsers = args.redmineUsers;
    newState.itemCreation.redmineUsersLoaded = true;
    return newState;
}

export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreation.redmineUsersLoaded = false;
    return newState;
}

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineProjects = args.redmineProjects;
    newState.itemCreation.redmineProjectsLoaded = true;
    return newState;
}

