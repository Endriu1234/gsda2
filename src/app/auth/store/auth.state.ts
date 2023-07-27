import { FormGroupState, createFormGroupState } from "ngrx-forms";

export interface LogingFormData {
    user: string,
    password: string
}

export interface State {
    loginInProgress: boolean,
    user: string | null,
    token: string | null,
    expirationDate: Date | null,
    loggingFormData: FormGroupState<LogingFormData>;
}

export const LOGGING_FORMID = "LOGGING_FORMID";

export const initialState: State = {
    loginInProgress: false,
    user: null,
    token: null,
    expirationDate: null,
    loggingFormData: createFormGroupState<LogingFormData>(LOGGING_FORMID, {
        user: '',
        password: ''
    })
}