import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { RedmineTracker } from "../models/redmine-tracker.model";
import { RedmineUser } from "../models/redmine-user.model";
import { RedmineUserByLetter } from "../models/redmine-user-letter-model";
import { CRValidation } from "../models/cr-validation.model";
import { IssueValidation } from "../models/issue-validation.model";
import { TmsValidation } from "../models/tms-validation.model";
import { FromIdValidation } from "../models/fromId-validation.model";

export interface ItemCreationSetupData {
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineUsersByLetterLoaded: boolean;
    redmineUsersByLetter: RedmineUserByLetter[];
    redmineUsersByLetterFiltered: RedmineUserByLetter[];
    redmineProjectsFiltered: RedmineProject[];
    validatedCRs: CRValidation[];
    validatedIssues: IssueValidation[];
    validatedTms: TmsValidation[];
    validatedFromId: FromIdValidation[];
}

export function getItemCreationSetupDataInitialState(): ItemCreationSetupData {
    return {
        redmineTrackersLoaded: false,
        redmineTrackers: [],
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineUsersByLetterLoaded: false,
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
        redmineProjectsFiltered: [],
        validatedCRs: [],
        validatedIssues: [],
        validatedTms: [],
        validatedFromId: []
    };
}

export interface ItemCreationFromData {
    project: string;
    tracker: string;
    subject: string;
    description: string;
    user: string;
    issue: string;
    cr: string;
    tms: string;
}

export const ITEM_CREATION_FORMID = "ITEM_CREATION_FORMID";

export function getItemCreationFromDataInitialState(): FormGroupState<ItemCreationFromData> {
    return createFormGroupState<ItemCreationFromData>(ITEM_CREATION_FORMID, {
        project: '',
        tracker: '',
        subject: '',
        description: '',
        issue: '',
        user: '',
        cr: '',
        tms: ''
    });
}

export interface ItemCreationFromIdDialog {
    fromId: string;
}

export const ITEM_CREATION_DIALOG = "ITEM_CREATION_DIALOG";

export function getItemCreationFromIdDialogInitialState(): FormGroupState<ItemCreationFromIdDialog> {
    return createFormGroupState<ItemCreationFromIdDialog>(ITEM_CREATION_DIALOG, {
        fromId: ''
    });
}