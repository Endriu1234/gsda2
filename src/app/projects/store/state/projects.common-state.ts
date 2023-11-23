import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";

export interface ProjectsSetupData {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    softDevProjectsLoaded: boolean;
    softDevProjects: SoftDevProject[];
}

export function getProjectsSetupDataInitialState(): ProjectsSetupData {
    return {
        redmineProjectsLoaded: false,
        redmineProjects: [],
        softDevProjectsLoaded: false,
        softDevProjects: []
    }
}