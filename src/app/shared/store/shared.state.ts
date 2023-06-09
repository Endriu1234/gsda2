export const FORM_SAVE_STATE = "FORM_SAVE_STATE";

export enum FormSaveState {
    New = "New",
    Saving = "Saving",
    SavingWithRedirect = "SavingWithRedirect",
    SavingFailed = "SavingFailed",
    SavingSuccessful = "SavingSuccessful",
}

export const FORM_SEARCH_STATE = "FORM_SEARCH_STATE";

export enum FormSearchState {
    New = "New",
    Searching = "Searching",
    SearchSuccessful = "SearchSuccessful",
    SearchFailed = "SearchFailed"
}


export interface SnackbarNotification {
    timestamp: number;
    notification: string;
}

export interface State {
    snackbarNotifications: SnackbarNotification[];
}

export const initialState: State = {
    snackbarNotifications: []
}