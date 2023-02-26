import { RedmineProject } from "./models/redmine-project.model";
import { RedmineProjectsFilter } from "./models/redmine-project-filter";
import { SoftDevProject } from "./models/softdev-project.model";
import { SoftDevProjectsFilter } from "./models/softdev-project-filter";


export interface ProjectCreation {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    redmineProjectsFiltered: RedmineProject[];
    redmineProjectsFilter: RedmineProjectsFilter;
    softdevProjectsLoaded: boolean;
    softdevProjects: SoftDevProject[];
    softdevProjectsFiltered: SoftDevProject[];
    softdevProjectsFilter: SoftDevProjectsFilter;
}

export interface State {

    projectCreation: ProjectCreation;
}

export const initialState: State = {
    projectCreation: {
        redmineProjectsLoaded: false,
        redmineProjects: [],
        redmineProjectsFiltered: [],
        redmineProjectsFilter: { filter: null },
        softdevProjectsLoaded: false,
        softdevProjects: [],
        softdevProjectsFiltered: [],
        softdevProjectsFilter: { filter: null }
    }
}