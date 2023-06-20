import { RedmineProject } from "./models/redmine-project.model";
import { SoftDevProject } from "./models/softdev-project.model";
import { SnackBarIcon, State } from "./shared.state";

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
