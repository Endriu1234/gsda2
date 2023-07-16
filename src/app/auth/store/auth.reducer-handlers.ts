import { State } from "./auth.state";

export function startLogin(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = true;
    return newState;
};

export function loginSuccess(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = false;
    newState.logged = true;
    return newState;
};

export function loginFaliure(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = true;
    newState.logged = false;
    return newState;
};

export function logout(state: State): State {
    const newState: State = { ...state };
    newState.logged = false;
    return newState;
};