import { FormGroupState, unbox } from "ngrx-forms";
import { ProjectCreationFromData } from "./state/projects.project-creation-state";
import { VersionCreationFromData } from "./state/prjects.version-creation-state";

export function canProjectCreationFormBeSaved(formState: FormGroupState<ProjectCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid || 
        (unbox(formState.controls.inherit_public.value).filter(v => v === "Inherit members").length > 0 && !formState.controls.parent_project.value)) {
        return false;
    }

    return true;
}

export function canVersionCreationFormBeSaved(formState: FormGroupState<VersionCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid || 
        !formState.controls.redmine_project.value || formState.controls.redmine_project.value.length <= 0 ||
        !formState.controls.name.value || formState.controls.name.value.length <= 0 || 
        !formState.controls.sharing.value || formState.controls.sharing.value.length <= 0 ||
        (formState.controls.version.value && formState.controls.version.value.length > 0)) {
        return false;
    }

    return true;
}

export function canVersionCreationFormBeUpdated(formState: FormGroupState<VersionCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid || 
        !formState.controls.redmine_project.value || formState.controls.redmine_project.value.length <= 0 ||
        !formState.controls.name.value || formState.controls.name.value.length <= 0 || 
        !formState.controls.sharing.value || formState.controls.sharing.value.length <= 0 ||
        !(formState.controls.version.value && formState.controls.version.value.length > 0)) {
        return false;
    }

    return true;
}