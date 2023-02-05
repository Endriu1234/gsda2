import { RedmineProject } from "./models/redmine-project.model";
import { RedmineTracker } from "./models/redmine-tracker.model";
import { RedmineUser } from "./models/redmine-user.model";

export interface ItemCreation {
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
}

export interface State {

    itemCreation: ItemCreation;
}

export const initialState: State = {
    itemCreation: {
        redmineTrackersLoaded: false,
        redmineTrackers: [],
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineProjectsLoaded: false,
        redmineProjects: []
    }
}