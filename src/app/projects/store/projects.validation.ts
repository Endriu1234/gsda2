import { Store } from "@ngrx/store";
import { ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction } from "ngrx-forms";
import { Observable, of, switchMap, take } from "rxjs";
import { getRedmineProjects, getSoftDevProjects } from "./projects.selector";
import { State } from "./projects.state";

export function validateProject(store: Store<State>, validateProjectError: string, controlId: string, projectName: string): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Project invalid"));

    return store.select(getRedmineProjects).pipe(take(1), switchMap(projects => {
        if (projects.find(p => p.name == projectName))
            return of(new StartAsyncValidationAction(controlId, validateProjectError), new ClearAsyncErrorAction(controlId, validateProjectError));

        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Project invalid"));
    }));
}

export function validateSDProject(store: Store<State>, validateProjectError: string, controlId: string, projectName: string): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "SoftDev Project invalid"));

    return store.select(getSoftDevProjects).pipe(take(1), switchMap(sdProject => {
        if (sdProject.find(s => s.PRODUCT_VERSION_NAME == projectName))
            return of(new StartAsyncValidationAction(controlId, validateProjectError), new ClearAsyncErrorAction(controlId, validateProjectError));

        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "SoftDev Project invalid"));
    }));
}