import { RedmineProject } from "./models/redmine-project.model";
import { RedmineTracker } from "./models/redmine-tracker.model";
import { RedmineUser } from "./models/redmine-user.model";
import { createFormGroupState, FormGroupState } from "ngrx-forms";
import { CRValidation } from "./models/cr-validation.model";
import { RedmineUserByLetter } from "./models/redmine-user-letter-model";

export interface ItemCreationSetupData {
    redmineTrackersLoaded: boolean;
    redmineTrackers: RedmineTracker[];
    redmineUsersLoaded: boolean;
    redmineUsers: RedmineUser[];
    redmineUsersByLetterLoaded: boolean;
    redmineUsersByLetter: RedmineUserByLetter[];
    redmineUsersByLetterFiltered: RedmineUserByLetter[];
    redmineProjectsLoaded: boolean;
    redmineProjects: RedmineProject[];
    redmineProjectsFiltered: RedmineProject[];
    validatedCRs: CRValidation[];
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

export interface State {

    itemCreationSetupData: ItemCreationSetupData;
    itemCreationFromData: FormGroupState<ItemCreationFromData>;
}

export const ITEM_CREATION_FORMID = "ITEM_CREATION_FORMID";

export const initialState: State = {
    itemCreationSetupData: {
        redmineTrackersLoaded: false,
        redmineTrackers: [],
        redmineUsersLoaded: false,
        redmineUsers: [],
        redmineUsersByLetterLoaded: false,
        redmineUsersByLetter: [],
        redmineUsersByLetterFiltered: [],
        redmineProjectsLoaded: false,
        redmineProjects: [],
        redmineProjectsFiltered: [],
        validatedCRs: []
    },
    itemCreationFromData: createFormGroupState<ItemCreationFromData>(ITEM_CREATION_FORMID, {
        project: '',
        tracker: '',
        subject: '',
        description: '',
        issue: '',
        user: '',
        cr: '',
        tms: ''
    })
}