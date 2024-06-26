import { createSelector } from '@ngrx/store';
import { State } from '../state/items.state';
import { getItemsState } from './items.common-selectors';
import { FormControlState, FormGroupState } from 'ngrx-forms';
import { ItemCreationFromData, ItemCreationMode } from '../state/items.item-creation-state';

export const getItemCreationSetupData = createSelector(getItemsState, (state: State) => state.itemCreationSetupData);
export const getItemCreationMode = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.mode);
export const getRedmineProjectsFilteredForItemCreation = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjectsFiltered);

export const getRedmineUsersByLetterFiltered = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersByLetterFiltered);
export const getRedmineVersionsByProject = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineVersions);

export const getValidatedCRs = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedCRs);
export const getValidatedIssues = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedIssues);
export const getValidatedTms = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedTms);
export const getItemCreationDialogState = createSelector(getItemsState, (state: State) => state.itemCreationFromIdDialog);
export const getItemCreationUserPreferencesState = createSelector(getItemsState, (state: State) => state.itemCreationUserPreferences);
export const getItemCreationUserPreferencesSetupData = createSelector(getItemsState, (state: State) => state.itemCreationUserPreferencesSetupData);
export const getItemCreationFormState = createSelector(getItemsState, (state: State) => state.itemCreationFromData);
export const isVersionRefreshingInProgress = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.refreshingVersions);

export const getItemCreationFormTmsControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.tms);
export const getItemCreationFormCRControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.cr);
export const getItemCreationFormIssueControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.issue);
export const getItemCreationFormDescriptionControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.description);
export const getItemCreationFormSubjectControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.subject);
export const getItemCreationFormFilestControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.files.value);

export const getItemCreationFormWithSetup = createSelector(getItemCreationFormState, getItemCreationSetupData, (creationFormState, creationFormSetupState) => {
    return {
        creationFormState: creationFormState,
        creationFormSetupState: creationFormSetupState
    }
});

export const getItemCreationFormSuitableForDefault = createSelector(getItemCreationFormTmsControl, getItemCreationFormCRControl,
    getItemCreationFormIssueControl, getItemCreationFormDescriptionControl, getItemCreationFormSubjectControl,
    isItemCreationFormSuitableForDefault);
export const getItemCreationFormCanActivateSave = createSelector(getItemCreationFormState, canItemCreationFormBeSaved);

function canItemCreationFormBeSaved(formState: FormGroupState<ItemCreationFromData>): boolean {
    if (!formState.value || formState.isValidationPending || formState.isInvalid) {
        return false;
    }

    return true;
}

function isItemCreationFormSuitableForDefault(tmsControl: FormControlState<string>, crControl: FormControlState<string>,
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

export const isItemCreationFormCreatedFromBatch = createSelector(getItemCreationMode, isItemFromBatch);

function isItemFromBatch(mode: ItemCreationMode): boolean {
    if (mode === ItemCreationMode.BatchItemSingleRecord || mode === ItemCreationMode.BatchItemWithGUI || mode === ItemCreationMode.BatchItemWithoutGUI) {
        return true;
    }

    return false;
}

