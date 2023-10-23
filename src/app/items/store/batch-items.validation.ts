import { Store } from "@ngrx/store";
import { ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction } from "ngrx-forms";
import { Observable, of, switchMap, take } from 'rxjs';
import { State } from "./state/items.state";
import { getRedmineProjects, getRedmineUsers, getSoftDevProjects } from "./selectors/items.common-selectors";
import { HttpParams } from "@angular/common/http";
import { getTmsClients } from "./selectors/items.batch-item-creation-selectors";


export function validateSDProject(store: Store<State>, validateProjectError: string, controlId: string, projectName: string): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "SoftDev Project invalid"));

    return store.select(getSoftDevProjects).pipe(take(1), switchMap(sdProject => {
        if (sdProject.find(s => s.PROJECT_NAME == projectName))
            return of(new StartAsyncValidationAction(controlId, validateProjectError), new ClearAsyncErrorAction(controlId, validateProjectError));

        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "SoftDev Project invalid"));
    }));
}

export function validateRedmineProject(store: Store<State>, validateProjectError: string, controlId: string, projectName: string): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Redmine project invalid"));

    return store.select(getRedmineProjects).pipe(take(1), switchMap(project => {
        if (project.find(p => p.name == projectName))
            return of(new StartAsyncValidationAction(controlId, validateProjectError), new ClearAsyncErrorAction(controlId, validateProjectError));

        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Redmine project invalid"));
    }));
}

export function validateTms(store: Store<State>, validateTmsError: string, controlId: string, tms: string): Observable<any> {

    if (!tms)
        return of(new StartAsyncValidationAction(controlId, validateTmsError), new ClearAsyncErrorAction(controlId, validateTmsError));

    if (!new RegExp("^[a-zA-Z0-9]+$").test(tms))
        return of(new StartAsyncValidationAction(controlId, validateTmsError), new SetAsyncErrorAction(controlId, validateTmsError, "Tms number invalid"));

    let params = new HttpParams();
    params = params.append("iTMSClient", tms);

    return store.select(getTmsClients).pipe(take(1), switchMap(client => {
        if (client.find(c => c.TMS_CLIENT == tms))
            return of(new StartAsyncValidationAction(controlId, validateTmsError), new ClearAsyncErrorAction(controlId, validateTmsError));

        return of(new StartAsyncValidationAction(controlId, validateTmsError), new SetAsyncErrorAction(controlId, validateTmsError, "Tms client invalid"));
    }));
}

export function validateUserForTms(store: Store<State>, validateUserError: string, controlId: string, userName: string): Observable<any> {

    if (!userName)
        return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

    return store.select(getRedmineUsers).pipe(take(1), switchMap(users => {
        if (users.find(u => u.name == userName))
            return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

        return of(new StartAsyncValidationAction(controlId, validateUserError), new SetAsyncErrorAction(controlId, validateUserError, "User For iTms invalid"));
    }));
}

export function validateIds(store: Store<State>, validateIdsError: string, controlId: string, Ids: string): Observable<any> {

    if (!Ids)
        return of(new StartAsyncValidationAction(controlId, validateIdsError), new SetAsyncErrorAction(controlId, validateIdsError, "No CR/ISS/TMS item provided"));

    let error = '';
    const tmpIds = Ids.replace(/\s/g,';').replace(/\|/g,';').replace(/,/g,';').replace(/(;)\1+/g,';');
    const tblIds = tmpIds.split(';');

    for (let id of tblIds) {
        if (id && id.length > 0) {
            if (id.startsWith('ISS')) {
                if (!new RegExp("^(I|i)(S|s)(S|s)-[a-zA-Z]+-\\d{1,6}[a-zA-Z]{2}$").test(id)) { error = 'One of the issues is incorrect'; break; }
            } else if (id.startsWith('CR')) {
                if (!new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(id)) { error = 'One of the CRs is incorrect'; break; }
            } else {
                if (!new RegExp("^[a-zA-Z0-9]+-\\d{5}$").test(id)) { error = 'One of the TMS tasks is incorrect'; break; }
            }
        }
    }

    if (error.length > 0) {
        return of(new StartAsyncValidationAction(controlId, validateIdsError), new SetAsyncErrorAction(controlId, validateIdsError, error));
    } else {
        return of(new StartAsyncValidationAction(controlId, validateIdsError), new ClearAsyncErrorAction(controlId, validateIdsError));
    }
}