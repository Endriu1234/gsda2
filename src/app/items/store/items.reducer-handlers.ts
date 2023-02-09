import { State } from './items.state';
import * as _ from 'lodash';
import { RedmineTracker } from './models/redmine-tracker.model';
import { RedmineUser } from './models/redmine-user.model';
import { RedmineProject } from './models/redmine-project.model';
import { RedmineUsersFilter } from './models/redmine-user-filter';
import { RedmineProjectsFilter } from './models/redmine-project-filter';
import { RedmineUserByLetter } from './models/redmine-user-letter-model';
import { RedmineUsersByLetterFilter } from './models/redmine-user-letter-filter';

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
    //console.dir(args.redmineUsers);
    newState.itemCreation.redmineUsers = args.redmineUsers;
    newState.itemCreation.redmineUsersFiltered = filterRedmineUsers(args.redmineUsers, newState.itemCreation.redmineUsersFilter);
    newState.itemCreation.redmineUsersLoaded = true;
    return newState;
}

export function setRedmineUsersFilter(state: State, args: { redmineUsersFilter: RedmineUsersFilter }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineUsersFilter = args.redmineUsersFilter;
    newState.itemCreation.redmineUsersFiltered = filterRedmineUsers(newState.itemCreation.redmineUsers, args.redmineUsersFilter);
    return newState;
}

function filterRedmineUsers(allUsers: RedmineUser[], filter: RedmineUsersFilter): RedmineUser[] {
    if (filter.filter) {
        if (filter.filter instanceof RedmineUser)
            return [filter.filter];

        if (typeof filter.filter === 'string') {
            let filterStr: string = filter.filter;
            return allUsers.filter(u => u.name.toLocaleLowerCase().includes(filterStr.toLocaleLowerCase()));
        }
    }

    return allUsers;
}

export function initRedmineUsersByLetter(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreation.redmineUsersByLetterLoaded = false;
    return newState;
}

export function loadRedmineUsersByLetter(state: State, args: { redmineUsersByLetter: RedmineUserByLetter[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineUsersByLetter = args.redmineUsersByLetter;
    newState.itemCreation.redmineUsersByLetterFiltered = filterRedmineUsersGroup(args.redmineUsersByLetter, newState.itemCreation.redmineUsersByLetterFilter);
    newState.itemCreation.redmineUsersByLetterLoaded = true;
    return newState;
}

export function setRedmineUsersByLetterFilter(state: State, args: { redmineUsersByLetterFilter: RedmineUsersByLetterFilter }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineUsersByLetterFilter = args.redmineUsersByLetterFilter;
    newState.itemCreation.redmineUsersByLetterFiltered = filterRedmineUsersGroup(newState.itemCreation.redmineUsersByLetter, args.redmineUsersByLetterFilter);
    return newState;
}

function filterRedmineUsersGroup(allUsers: RedmineUserByLetter[], filter: RedmineUsersByLetterFilter): RedmineUserByLetter[] {
    if (filter.filter) {
        if (filter.filter instanceof RedmineUserByLetter)
            return [filter.filter];

        if (typeof filter.filter === 'string') {
            return allUsers.map(group => ({letter: group.letter, redmineUsers: filterRemineUserByLetter(group.redmineUsers, filter)})).filter(group => group.redmineUsers.length > 0);
        }
    }

    return allUsers;
}

function filterRemineUserByLetter(allUsers: RedmineUser[], filter: RedmineUsersByLetterFilter): RedmineUser[] {
    if (filter.filter && allUsers) {
        if (filter.filter instanceof RedmineUser)
            return [filter.filter];
        
        if (typeof filter.filter === 'string') {
            let filterStr: string = filter.filter;
            return allUsers.filter(u => u.name.toLocaleLowerCase().includes(filterStr.toLocaleLowerCase()));
        }
    }

    return allUsers;
}

export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreation.redmineUsersLoaded = false;
    return newState;
}

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineProjects = args.redmineProjects;
    newState.itemCreation.redmineProjectsFiltered = filterRedmineProjects(args.redmineProjects, newState.itemCreation.redmineProjectsFilter);
    newState.itemCreation.redmineProjectsLoaded = true;
    return newState;
}

export function setRedmineProjectsFilter(state: State, args: { redmineProjectsFilter: RedmineProjectsFilter }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreation.redmineProjectsFilter = args.redmineProjectsFilter;
    newState.itemCreation.redmineProjectsFiltered = filterRedmineProjects(newState.itemCreation.redmineProjects, args.redmineProjectsFilter);
    return newState;
}

function filterRedmineProjects(allProjects: RedmineProject[], filter: RedmineProjectsFilter): RedmineProject[] {
    if (filter.filter) {
        if (filter.filter instanceof RedmineProject)
            return [filter.filter];

        if (typeof filter.filter === 'string') {
            let filterStr: string = filter.filter;
            return allProjects.filter(u => u.name.toLocaleLowerCase().includes(filterStr.toLocaleLowerCase()));
        }
    }

    return allProjects;
}


