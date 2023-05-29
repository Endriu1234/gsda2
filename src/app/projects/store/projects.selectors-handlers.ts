import { FormGroupState, unbox } from "ngrx-forms";
import { ProjectCreationFromData } from "./projects.state";

export function canProjectCreationFormBeSaved(formState: FormGroupState<ProjectCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid || 
        (unbox(formState.controls.inherit_public.value).filter(v => v === "Inherit members").length > 0 && !formState.controls.parent_project.value)) {
        return false;
    }

    return true;
}