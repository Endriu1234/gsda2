import { State } from "./auth.state";

export function startLogin(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = true;
    return newState;
};

export function loginSuccess(state: State, args: { user: string, token: string, expirationDate: Date | null }): State {
    const newState: State = { ...state };
    newState.loginInProgress = false;
    newState.user = args.user;
    newState.token = args.token;
    newState.expirationDate = args.expirationDate;
    return newState;
};

export function loginFaliure(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = false;
    newState.token = null;
    newState.expirationDate = null;
    newState.user = null;
    return newState;
};

export function logout(state: State): State {
    const newState: State = { ...state };
    newState.token = null;
    newState.expirationDate = null;
    newState.user = null;
    return newState;
};