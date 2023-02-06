import { RedmineProject } from "./models/redmine-project.model";
import { RedmineProjectsFilter } from "./models/redmine-project-filter";
import { RedmineTracker } from "./models/redmine-tracker.model";
import { RedmineUsersFilter } from "./models/redmine-user-filter";
import { RedmineUser } from "./models/redmine-user.model";



export interface ItemCreation {
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineUsersFiltered: RedmineUser[];
    redmineUsersFilter: RedmineUsersFilter;
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    redmineProjectsFiltered: RedmineProject[];
    redmineProjectsFilter: RedmineProjectsFilter;
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
        redmineUsersFiltered: [],
        redmineUsersFilter: { filter: null },
        redmineProjectsLoaded: false,
        redmineProjects: [],
        redmineProjectsFiltered: [],
        redmineProjectsFilter: { filter: null }
    }
}