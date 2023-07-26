import { State } from "./auth.state";
import { AuthDataHttpResponse } from "./models/auth-data-http-response";

export function startLogin(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = true;
    return newState;
};

export function loginSuccess(state: State, args: { authData: AuthDataHttpResponse }): State {
    const newState: State = { ...state };
    newState.loginInProgress = false;
    newState.token = args.authData.token;
    newState.expiresIn = args.authData.expiresIn;
    return newState;
};

export function loginFaliure(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = false;
    newState.token = null;
    newState.expiresIn = null;
    return newState;
};

export function logout(state: State): State {
    const newState: State = { ...state };
    newState.token = null;
    newState.expiresIn = null;
    return newState;
};