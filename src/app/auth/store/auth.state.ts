import { FormGroupState, createFormGroupState } from "ngrx-forms";

export interface LogingFormData {
    user: string,
    password: string
}

export interface State {
    loginInProgress: boolean,
    token: string | null,
    expiresIn: string | null,
    loggingFormData: FormGroupState<LogingFormData>;
}

export const LOGGING_FORMID = "LOGGING_FORMID";

export const initialState: State = {
    loginInProgress: false,
    token: null,
    expiresIn: null,
    loggingFormData: createFormGroupState<LogingFormData>(LOGGING_FORMID, {
        user: '',
        password: ''
    })
}