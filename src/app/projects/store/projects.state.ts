import { RedmineProject } from "../../shared/store/models/redmine-project.model";
import { SoftDevProject } from "./models/softdev-project.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";

export const PROJECT_CREATION_FORMID = "PROJECT_CREATION_FORMID";
export const PROJECT_CREATION_DIALOG = "PROJECT_CREATION_DIALOG";

export interface ProjectCreationSetupData {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    redmineProjectsFiltered: RedmineProject[];
    softdevProjectsLoaded: boolean;
    softdevProjects: SoftDevProject[];
    softdevProjectsFiltered: SoftDevProject[];
}

export interface ProjectCreationFromData {
    redmineProject: string;
    name: string;
    identifier: string;
    description: string;
    wiki: string;
}

export interface ProjectCreationFromIdDialog {
    projectId: string;
}

export interface State {

    projectCreationSetupData: ProjectCreationSetupData;
    projectCreationFromData: FormGroupState<ProjectCreationFromData>;
    projectCreationFromIdDialog: FormGroupState<ProjectCreationFromIdDialog>;
}

export const initialState: State = {
    projectCreationSetupData: {
        redmineProjectsLoaded: false,
        redmineProjects: [],
        redmineProjectsFiltered: [],
        softdevProjectsLoaded: false,
        softdevProjects: [],
        softdevProjectsFiltered: []
    },
    projectCreationFromData: createFormGroupState<ProjectCreationFromData>(PROJECT_CREATION_FORMID, {
        redmineProject: '',
        name: '',
        identifier: '',
        description: '',
        wiki: ''
    }),
    projectCreationFromIdDialog: createFormGroupState<ProjectCreationFromIdDialog>(PROJECT_CREATION_DIALOG, {
        projectId: ''
    })
}