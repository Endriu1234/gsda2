import { State } from "./auth.state";

export function startLogin(state: State): State {
    const newState: State = { ...state };
    newState.loginInProgress = true;
    return newState;
};