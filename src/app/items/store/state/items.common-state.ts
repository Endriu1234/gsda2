import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";

export interface ItemsSetupData {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    softDevProjectsLoaded: boolean;
    softDevProjects: SoftDevProject[];
}

export function getItemsSetupDataInitialState(): ItemsSetupData {
    return {
        redmineProjectsLoaded: false,
        redmineProjects: [],
        softDevProjectsLoaded: false,
        softDevProjects: []
    }
}
