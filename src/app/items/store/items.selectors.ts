import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemsReducerKey } from './items.reducer';
import { State } from './items.state';


export const getItemsState = createFeatureSelector<State>(itemsReducerKey);
export const getItemCreationSetupData = createSelector(getItemsState, (state: State) => state.itemCreationSetupData);
export const getRedmineTrackers = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineTrackers);
export const getRedmineTrackersLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineTrackersLoaded);
export const getRedmineUsers = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsers);
export const getRedmineUsersLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersLoaded);

export const getRedmineUsersByLetter = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersByLetter);
export const getRedmineUsersByLetterFiltered = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersByLetterFiltered);
export const getRedmineUsersByLetterLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineUsersByLetterLoaded);

export const getRedmineProjects = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjects);
export const getRedmineProjectsFiltered = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjectsFiltered);
export const getRedmineProjectsLoaded = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.redmineProjectsLoaded);
export const getValidatedCRs = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedCRs);
export const getValidatedIssues = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedIssues);
export const getValidatedTms = createSelector(getItemsState, (state: State) => state.itemCreationSetupData.validatedTms);
export const getItemCreationDialogState = createSelector(getItemsState, (state: State) => state.itemCreationFromIdDialog);
export const getItemCreationFormState = createSelector(getItemsState, (state: State) => state.itemCreationFromData);
export const getItemCreationFormTmsControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.tms);
export const getItemCreationFormCRControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.cr);
export const getItemCreationFormIssueControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.issue);
export const getItemCreationFormDescriptionControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.description);
export const getItemCreationFormSubjectControl = createSelector(getItemsState, (state: State) => state.itemCreationFromData.controls.subject);

export const getItemCreationFormSuitableForDefault = createSelector(getItemCreationFormTmsControl, getItemCreationFormCRControl,
    getItemCreationFormIssueControl, getItemCreationFormDescriptionControl, getItemCreationFormSubjectControl,
    (tmsControl, crControl, issueControl, descriptionControl, subjectControl) => {
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
    });