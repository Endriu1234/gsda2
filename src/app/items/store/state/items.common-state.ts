import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";
import { RedmineTracker } from "../models/redmine-tracker.model";

export interface ItemsSetupData {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    softDevProjectsLoaded: boolean;
    softDevProjects: SoftDevProject[];
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
}

export function getItemsSetupDataInitialState(): ItemsSetupData {
    return {
        redmineProjectsLoaded: false,
        redmineProjects: [],
        softDevProjectsLoaded: false,
        softDevProjects: [],
        redmineTrackersLoaded: false,
        redmineTrackers: []
    }
}
