import * as _ from 'lodash';
import { State } from '../items.state';
import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { filterRedmineProjects, filterSoftDevProjects } from "src/app/shared/store/shared.reducer-handlers";
import { RedmineTracker } from '../models/redmine-tracker.model';
import { RedmineUser } from '../models/redmine-user.model';
import { RedmineUserByLetter } from '../models/redmine-user-letter-model';
import { SoftDevProject } from 'src/app/shared/store/models/softdev-project.model';

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsSetupData.redmineProjects = args.redmineProjects;
    newState.itemsSetupData.redmineProjectsLoaded = true;
    newState.itemCreationSetupData.redmineProjectsFiltered
        = filterRedmineProjects(args.redmineProjects, newState.itemCreationFromData.value.project);
    newState.batchItemCreationSdCriteriaSetupData.redmineProjectsFiltered
        = filterRedmineProjects(args.redmineProjects, newState.batchItemCreationSdCriteriaFormData.value.targetRedmineProject);
    return newState;
}

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
    newState.itemCreationSetupData.redmineUsersByLetter = createUsersByLetter(newState.itemCreationSetupData.redmineUsers);
    newState.itemCreationSetupData.redmineUsersByLetterFiltered = filterRedmineUsersGroup(newState.itemCreationSetupData.redmineUsersByLetter, newState.itemCreationFromData.value.user);
    newState.itemCreationSetupData.redmineUsersLoaded = true;
    return newState;
}

function createUsersByLetter(allUsers: RedmineUser[]): RedmineUserByLetter[] {
    let usersByLetter: RedmineUserByLetter[] = [];
    let letter = '';
    let usersTmp: RedmineUser[] = [];

    if (allUsers) {
        allUsers.forEach(element => {
            if (element.name[0] !== letter) {
                if (letter !== '') {
                    usersByLetter.push({ letter: letter, redmineUsers: usersTmp.slice() });
                }
                letter = element.name[0];
                usersTmp.length = 0;
            }
            usersTmp.push(element);
        });
        if (letter !== '') {
            usersByLetter.push({ letter: letter, redmineUsers: usersTmp.slice() });
        }
    }

    return usersByLetter;
}

export function setRedmineUsersByLetterFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineUsersByLetterFiltered = filterRedmineUsersGroup(newState.itemCreationSetupData.redmineUsersByLetter, newState.itemCreationFromData.value.user);
    return newState;
}

export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemsSetupData.redmineProjectsLoaded = false;
    return newState;
}

export function initSoftDevProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemsSetupData.softDevProjectsLoaded = false;
    return newState;
}

export function loadSoftDevProjects(state: State, args: { softDevProjects: SoftDevProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemsSetupData.softDevProjects = args.softDevProjects;
    newState.itemsSetupData.softDevProjectsLoaded = true;
    newState.batchItemCreationSdCriteriaSetupData.softDevProjectsFiltered
        = filterSoftDevProjects(args.softDevProjects, newState.batchItemCreationSdCriteriaFormData.value.targetRedmineProject);
    return newState;
}

function filterRedmineUsersGroup(allUsers: RedmineUserByLetter[], filter: string): RedmineUserByLetter[] {

    if (filter)
        return allUsers.map(group => ({ letter: group.letter, redmineUsers: filterRedmineUsers(group.redmineUsers, filter) })).filter(group => group.redmineUsers.length > 0);

    return allUsers;
}

function filterRedmineUsers(allUsers: RedmineUser[], filter: string): RedmineUser[] {
    if (filter)
        return allUsers.filter(u => u.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allUsers;
}