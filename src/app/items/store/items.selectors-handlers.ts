import { FormControlState, FormGroupState } from "ngrx-forms";
import { ItemCreationFromData } from "./items.state";


export function isItemCreationFormSuitableForDefault(tmsControl: FormControlState<string>, crControl: FormControlState<string>, 
        issueControl: FormControlState<string>, descriptionControl: FormControlState<string>, subjectControl: FormControlState<string>): boolean {
    if (descriptionControl.value || subjectControl.value)
            return false;

        if (tmsControl.value) {
            if (crControl.value || issueControl.value)
                return false;

            return tmsControl.isTouched && !tmsControl.isValidationPending && tmsControl.isValid;
        }
        else if (crControl.value) {
            if (issueControl.value || tmsControl.value)
                return false;

            return crControl.isTouched && !crControl.isValidationPending && crControl.isValid;
        }
        else if (issueControl.value) {
            if (crControl.value || tmsControl.value)
                return false;

            return issueControl.isTouched && !issueControl.isValidationPending && issueControl.isValid;
        }

        return false;
}

export function canItemCreationFormBeSaved(formState: FormGroupState<ItemCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid) {
        return false;
    }

    return true;
}