import { FormGroupState } from "ngrx-forms";
import { ProjectCreationFromData } from "./projects.state";

export function canProjectCreationFormBeSaved(formState: FormGroupState<ProjectCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid) {
        return false;
    }

    return true;
}