import * as _ from 'lodash';
import { filterRedmineProjects } from "src/app/shared/store/shared.reducer-handlers";
import { State } from "../state/items.state";
import { CRValidation } from '../models/cr-validation.model';
import { IssueValidation } from '../models/issue-validation.model';
import { TmsValidation } from '../models/tms-validation.model';
import { FromIdValidation } from '../models/fromId-validation.model';
import { ITEM_CREATION_FORMID, ItemCreationMode } from '../state/items.item-creation-state';
import { RedmineVersion } from '../../../shared/store/models/redmine-version.model';
import { UserPreferences } from '../models/itemcreation/userPreferences.model';

export function setRedmineProjectsFilterForItemCreation(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.itemCreationFromData.value.project);
    return newState;
}

export function addValidatedCR(state: State, args: { validatedCR: CRValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedCRs.push(args.validatedCR);
    return newState;
}

export function addValidatedIssue(state: State, args: { validatedIssue: IssueValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedIssues.push(args.validatedIssue);
    return newState;
}

export function addValidatedTms(state: State, args: { validatedTms: TmsValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedTms.push(args.validatedTms);
    return newState;
}

export function addValidatedFromId(state: State, args: { validatedFromId: FromIdValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedFromId.push(args.validatedFromId);
    return newState;
}

export function startResetItemCreationForm(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.resetInProgress = true;
    return newState;
}

export function endResetItemCreationForm(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.resetInProgress = false;
    return newState;
}

export function setItemCreationFormMode(state: State, args: { mode: ItemCreationMode }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.mode = args.mode;
    return newState;
}

export function initRedmineVersions(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersions(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineVersions = args.redmineVersions;
    newState.itemCreationSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersions(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineVersions = [];
    newState.itemCreationSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function startLoadingItemCreationUserPreferences(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationUserPreferencesSetupData.userPreferences.formId = ITEM_CREATION_FORMID;
    newState.itemCreationSetupData.loadingUserPreferences = true;
    return newState;
}

export function endLoadingItemCreationUserPreferences(state: State, args: { preferences: UserPreferences | null }): State {
    const newState: State = _.cloneDeep(state);
    if (args.preferences) {
        newState.itemCreationUserPreferencesSetupData.userPreferences = _.cloneDeep(args.preferences);
    }
    newState.itemCreationSetupData.loadingUserPreferences = false;
    return newState;
 } 

 export function saveItemCreationUserPreferences(state: State, args: { updateSetup: boolean }): State {
    const newState: State = _.cloneDeep(state);
    if (args.updateSetup) {
        newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberProject = newState.itemCreationUserPreferences.controls.rememberProject.value;
        if (!newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberProject) {
            newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.project = '';
        }
        newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberTracker = newState.itemCreationUserPreferences.controls.rememberTracker.value;
        if (!newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberTracker) {
            newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.tracker = '';
        }
        newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberUser = newState.itemCreationUserPreferences.controls.rememberUser.value;
        if (!newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberUser) {
            newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.user = '';
        }
        newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberVersion = newState.itemCreationUserPreferences.controls.rememberVersion.value;
        if (!newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberVersion) {
            newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.version = '';
        }
    }
    return newState;
}

export function setItemCreationUserPreferencesSetupByCtrl(state: State, args: { control: string }): State {
    const newState: State = _.cloneDeep(state);
    
    if (newState.itemCreationSetupData.mode  === ItemCreationMode.SingleItem) {
        if (args.control === ITEM_CREATION_FORMID + '.project') {
            if (newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberProject) {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.project = newState.itemCreationFromData.controls.project.value;
            } else {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.project = '';
            }
        } else if (args.control === ITEM_CREATION_FORMID + '.user') {
            if (newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberUser) {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.user = newState.itemCreationFromData.controls.user.value;
            } else {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.user = '';
            }
        } else if (args.control === ITEM_CREATION_FORMID + '.version') {
            if (newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberVersion) {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.version = newState.itemCreationFromData.controls.version.value;
            } else {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.version = '';
            }
        } else if (args.control === ITEM_CREATION_FORMID + '.tracker') {
            if (newState.itemCreationUserPreferencesSetupData.userPreferences.setupValues.rememberTracker) {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.tracker = newState.itemCreationFromData.controls.tracker.value;
            } else {
                newState.itemCreationUserPreferencesSetupData.userPreferences.currentValues.tracker = '';
            }
        } 
    }

    return newState;
}
