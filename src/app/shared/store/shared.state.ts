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

export enum SnackBarIcon {
    Success = "success",
    Error = "error",
    Warning = "warning",
    Info = "info",
    Question = "question"
}

export interface SnackbarNotification {
    timestamp: number;
    notification: string;
    icon: SnackBarIcon;
}

export interface State {
    snackbarNotifications: SnackbarNotification[];
}

export const initialState: State = {
    snackbarNotifications: []
}