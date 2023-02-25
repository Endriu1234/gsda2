import { State } from './items.state';
import * as _ from 'lodash';
import { RedmineTracker } from './models/redmine-tracker.model';
import { RedmineUser } from './models/redmine-user.model';
import { RedmineProject } from './models/redmine-project.model';
import { CRValidation } from './models/cr-validation.model';

export function initRedmineTrackers(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineTrackersLoaded = false;
    return newState;
}

export function loadRedmineTrackers(state: State, args: { redmineTrackers: RedmineTracker[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineTrackers = args.redmineTrackers;
    newState.itemCreationSetupData.redmineTrackersLoaded = true;
    return newState;

}

export function initRedmineUsers(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineUsersLoaded = false;
    return newState;
}

export function loadRedmineUsers(state: State, args: { redmineUsers: RedmineUser[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineUsers = args.redmineUsers;
    newState.itemCreationSetupData.redmineUsersFiltered = filterRedmineUsers(args.redmineUsers, newState.itemCreationFromData.value.user);
    newState.itemCreationSetupData.redmineUsersLoaded = true;
    return newState;
}

export function setRedmineUsersFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineUsersFiltered
        = filterRedmineUsers(newState.itemCreationSetupData.redmineUsers, newState.itemCreationFromData.value.user);
    return newState;
}

function filterRedmineUsers(allUsers: RedmineUser[], filter: string): RedmineUser[] {
    if (filter)
        return allUsers.filter(u => u.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allUsers;
}

export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineUsersLoaded = false;
    return newState;
}

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineProjects = args.redmineProjects;
    newState.itemCreationSetupData.redmineProjectsFiltered = filterRedmineProjects(args.redmineProjects, newState.itemCreationFromData.value.project);
    newState.itemCreationSetupData.redmineProjectsLoaded = true;
    return newState;
}

export function addValidatedCR(state: State, args: { validatedCR: CRValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedCRs.push(args.validatedCR);
    return newState;
}

export function setRedmineProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineProjectsFiltered
        = filterRedmineProjects(newState.itemCreationSetupData.redmineProjects, newState.itemCreationFromData.value.project);
    return newState;
}

function filterRedmineProjects(allProjects: RedmineProject[], filter: string): RedmineProject[] {
    if (filter)
        return allProjects.filter(u => u.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allProjects;
}

