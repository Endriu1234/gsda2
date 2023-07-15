export interface State {
    loginInProgress: boolean,
    logged: boolean;
}

export const initialState: State = {
    loginInProgress: false,
    logged: false
}