import { FormGroupState } from "ngrx-forms";
import { ProjectsSetupData, getProjectsSetupDataInitialState } from "./projects.common-state";
import { ProjectCreationSetupData, ProjectCreationFromData, ProjectCreationFromIdDialog, getProjectCreationSetupDataInitialState, getProjectCreationFromDataInitialState, getProjectCreationFromIdDialogInitialState } from "./projects.project-creation-state";
import { VersionCreationFromData, VersionCreationSetupData, getVersionCreationFromDataInitialState, getVersionCreationSetupDataInitialState } from "./prjects.version-creation-state";

export interface State {
    projectsSetupData: ProjectsSetupData;
    projectCreationSetupData: ProjectCreationSetupData;
    projectCreationFromData: FormGroupState<ProjectCreationFromData>;
    projectCreationFromIdDialog: FormGroupState<ProjectCreationFromIdDialog>;
    versionCreationSetupData: VersionCreationSetupData;
    versionCreationFormData: FormGroupState<VersionCreationFromData>;
}

export const initialState: State = {
    projectsSetupData: getProjectsSetupDataInitialState(),
    projectCreationSetupData: getProjectCreationSetupDataInitialState(),
    projectCreationFromData: getProjectCreationFromDataInitialState(),
    projectCreationFromIdDialog: getProjectCreationFromIdDialogInitialState(),
    versionCreationSetupData: getVersionCreationSetupDataInitialState(),
    versionCreationFormData: getVersionCreationFromDataInitialState()
}