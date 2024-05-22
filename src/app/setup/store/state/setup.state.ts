import { FormGroupState } from "ngrx-forms";
import { CacheRefreshFromData, CacheRefreshSetupData, getCacheRefreshFromDataInitialState, getCacheRefreshSetupDataInitialState } from "./setup.cache-refresh-state";


export interface State {
    cacheRefreshSetupData: CacheRefreshSetupData;
    cacheRefreshFormData: FormGroupState<CacheRefreshFromData>;
}

export const initialState: State = {
    cacheRefreshSetupData: getCacheRefreshSetupDataInitialState(),
    cacheRefreshFormData: getCacheRefreshFromDataInitialState()
}