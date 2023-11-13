import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "src/app/shared/store/models/softdev-project.model";
import { IdentifierValidation } from "../models/identifier-validation.model";
import { Boxed, FormGroupState, box, createFormGroupState } from "ngrx-forms";

export const PROJECT_CREATION_FORMID = "PROJECT_CREATION_FORMID";
export const PROJECT_CREATION_DIALOG = "PROJECT_CREATION_DIALOG";

export interface ProjectCreationSetupData {
    redmineProjectsFiltered: RedmineProject[];
    softdevProjectsFiltered: SoftDevProject[];
    validatedIdentifiers: IdentifierValidation[];
}

export function getProjectCreationSetupDataInitialState(): ProjectCreationSetupData {
    return {
        redmineProjectsFiltered: [],
        softdevProjectsFiltered: [],
        validatedIdentifiers: []
    };
}

export interface ProjectCreationFromData {
    parent_project: string;
    name: string;
    identifier: string;
    description: string;
    inherit_public: Boxed<string[]>;
    wiki: string;
}

export function getProjectCreationFromDataInitialState(): FormGroupState<ProjectCreationFromData> {
    return createFormGroupState<ProjectCreationFromData>(PROJECT_CREATION_FORMID, {
        parent_project: '',
        name: '',
        identifier: '',
        description: '',
        inherit_public: box(['Public']),
        wiki: ''
    });
}

export interface ProjectCreationFromIdDialog {
    projectId: string;
}

export function getProjectCreationFromIdDialogInitialState(): FormGroupState<ProjectCreationFromIdDialog> {
    return createFormGroupState<ProjectCreationFromIdDialog>(PROJECT_CREATION_DIALOG , {
        projectId: ''
    });
}