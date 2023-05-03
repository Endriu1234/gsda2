export const FORM_SAVE_STATE = "FORM_SAVE_STATE";

export enum FormSaveState {
    New = "New",
    Saving = "Saving",
    SavingWithRedirect = "SavingWithRedirect",
    SavingFailed = "SavingFailed",
    SavingSuccessful = "SavingSuccessful",
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