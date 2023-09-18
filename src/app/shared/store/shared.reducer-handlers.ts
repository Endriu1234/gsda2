import { RedmineUserByLetter } from "src/app/shared/store/models/redmine-user-letter-model";
import { RedmineProject } from "./models/redmine-project.model";
import { SoftDevProject } from "./models/softdev-project.model";
import { SnackBarIcon, State } from "./shared.state";
import { RedmineUser } from "./models/redmine-user.model";
import { TmsClientByLetter } from "./models/tms-client-letter.model";
import { TmsClient } from "./models/tms-client.model";

export function addSnackbarNotification(state: State, args: { notification: string, icon: SnackBarIcon }): State {
    const newState: State = { ...state, snackbarNotifications: [...state.snackbarNotifications] };
    newState.snackbarNotifications.push({ timestamp: Date.now(), notification: args.notification, icon: args.icon });
    return newState;
}

export function clearDisplayedSnackbarNotifications(state: State, args: { timestamp: number }): State {
    const newState: State = { ...state };
    newState.snackbarNotifications = newState.snackbarNotifications.filter(n => n.timestamp > args.timestamp);
    return newState;
};

export function filterRedmineProjects(allProjects: RedmineProject[], filter: string): RedmineProject[] {
    if (filter)
        return allProjects.filter(u => u.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allProjects;
}

export function filterSoftDevProjects(allProjects: SoftDevProject[], filter: string): SoftDevProject[] {
    if (filter)
        return allProjects.filter(u => u.PROJECT_NAME.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allProjects;
}

export function filterRedmineUsersGroup(allUsers: RedmineUserByLetter[], filter: string): RedmineUserByLetter[] {

    if (filter)
        return allUsers.map(group => ({ letter: group.letter, redmineUsers: filterRedmineUsers(group.redmineUsers, filter) })).filter(group => group.redmineUsers.length > 0);

    return allUsers;
}

function filterRedmineUsers(allUsers: RedmineUser[], filter: string): RedmineUser[] {
    if (filter)
        return allUsers.filter(u => u.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allUsers;
}

export function filterTmsClientsGroup(allClients: TmsClientByLetter[], filter: string): TmsClientByLetter[] {

    if (filter)
        return allClients.map(group => ({ letter: group.letter, tmsClients: filterTmsClients(group.tmsClients, filter) })).filter(group => group.tmsClients.length > 0);

    return allClients;
}

function filterTmsClients(allClients: TmsClient[], filter: string): TmsClient[] {
    if (filter)
        return allClients.filter(u => u.TMS_CLIENT.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

    return allClients;
}
