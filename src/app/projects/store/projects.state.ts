import { RedmineProject } from "../../shared/store/models/redmine-project.model";
import { IdentifierValidation } from "./models/identifier-validation.model";
import { SoftDevProject } from "./models/softdev-project.model";
import { createFormGroupState, FormGroupState, Boxed, box } from "ngrx-forms";

export const PROJECT_CREATION_FORMID = "PROJECT_CREATION_FORMID";
export const PROJECT_CREATION_DIALOG = "PROJECT_CREATION_DIALOG";

export interface ProjectCreationSetupData {
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    redmineProjectsFiltered: RedmineProject[];
    softdevProjectsLoaded: boolean;
    softdevProjects: SoftDevProject[];
    softdevProjectsFiltered: SoftDevProject[];
    validatedIdentifiers: IdentifierValidation[];
}

export interface ProjectCreationFromData {
    parent_project: string;
    name: string;
    identifier: string;
    description: string;
    inherit_public: Boxed<string[]>;
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
        softdevProjectsFiltered: [],
        validatedIdentifiers: []
    },
    projectCreationFromData: createFormGroupState<ProjectCreationFromData>(PROJECT_CREATION_FORMID, {
        parent_project: '',
        name: '',
        identifier: '',
        description: '',
        inherit_public: box(['Public']),
        wiki: ''
    }),
    projectCreationFromIdDialog: createFormGroupState<ProjectCreationFromIdDialog>(PROJECT_CREATION_DIALOG, {
        projectId: ''
    })
}