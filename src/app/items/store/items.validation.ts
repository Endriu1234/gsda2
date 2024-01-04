import { Action, Store } from "@ngrx/store";
import { ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction } from "ngrx-forms";
import { State } from "./state/items.state";
import { catchError, concat, delay, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CRValidation } from "./models/cr-validation.model";
import { IssueValidation } from "./models/issue-validation.model";
import { TmsValidation } from "./models/tms-validation.model";
import { environment } from 'src/environments/environment';
import { addValidatedCR, addValidatedIssue, addValidatedTms } from "./actions/items.item-creation-actions";
import { getRedmineProjects, getRedmineUsers } from "./selectors/items.common-selectors";
import { getValidatedCRs, getValidatedIssues, getValidatedTms } from "./selectors/items.item-creation-selectors";


export function validateUser(store: Store<State>, validateUserError: string, controlId: string, userName: string): Observable<any> {

    if (!userName)
        return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

    return store.select(getRedmineUsers).pipe(take(1), switchMap(users => {
        if (users.find(u => u.name == userName))
            return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

        return of(new StartAsyncValidationAction(controlId, validateUserError), new SetAsyncErrorAction(controlId, validateUserError, "User invalid"));
    }));
}

export function validateCR(store: Store<State>, http: HttpClient, validateCRError: string, controlId: string, cr: string): Observable<any> {

    if (!cr)
        return of(new StartAsyncValidationAction(controlId, validateCRError), new ClearAsyncErrorAction(controlId, validateCRError));

    if (!new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(cr))
        return of(new StartAsyncValidationAction(controlId, validateCRError), new SetAsyncErrorAction(controlId, validateCRError, "CR invalid"));

    return store.select(getValidatedCRs).pipe(delay(300), take(1), switchMap(validatedCRs => {
        const alreadyValidatedCR = validatedCRs.find(cv => cv.cr === cr);

        if (alreadyValidatedCR) {
            if (alreadyValidatedCR.valid)
                return of(new StartAsyncValidationAction(controlId, validateCRError), new ClearAsyncErrorAction(controlId, validateCRError));
            else
                return of(new StartAsyncValidationAction(controlId, validateCRError), new SetAsyncErrorAction(controlId, validateCRError, "CR invalid"));
        }

        let params = new HttpParams();
        params = params.append("cr", cr);

        return concat(
            of(new StartAsyncValidationAction(controlId, validateCRError)),
            http.get<CRValidation>(environment.apiUrl + '/softdev/crs/check-cr', { params }).pipe(mergeMap(validatedCR => {

                if (validatedCR.valid)
                    return of(new ClearAsyncErrorAction(controlId, validateCRError), addValidatedCR({ validatedCR }));

                return of(new SetAsyncErrorAction(controlId, validateCRError, "CR invalid"), addValidatedCR({ validatedCR }));
            }), catchError(error => {
                console.log(error);
                return of(new SetAsyncErrorAction(controlId, validateCRError, "CR validation errored"));
            }))
        );
    }));
}


export function validateIssue(store: Store<State>, http: HttpClient, validateIssueError: string, controlId: string, issue: string): Observable<any> {

    if (!issue)
        return of(new StartAsyncValidationAction(controlId, validateIssueError), new ClearAsyncErrorAction(controlId, validateIssueError));

    if (!new RegExp("^(I|i)(S|s)(S|s)-[a-zA-Z]+-\\d{1,6}[a-zA-Z]{2}$").test(issue))
        return of(new StartAsyncValidationAction(controlId, validateIssueError), new SetAsyncErrorAction(controlId, validateIssueError, "Issue invalid"));



    return store.select(getValidatedIssues).pipe(delay(300), take(1), switchMap(validatedIssues => {
        const alreadyValidatedIssue = validatedIssues.find(iv => iv.issue === issue);

        if (alreadyValidatedIssue) {
            if (alreadyValidatedIssue.valid)
                return of(new StartAsyncValidationAction(controlId, validateIssueError), new ClearAsyncErrorAction(controlId, validateIssueError));
            else
                return of(new StartAsyncValidationAction(controlId, validateIssueError), new SetAsyncErrorAction(controlId, validateIssueError, "Issue invalid"));
        }

        let params = new HttpParams();
        params = params.append("issue", issue);

        return concat(
            of(new StartAsyncValidationAction(controlId, validateIssueError)),
            http.get<IssueValidation>(environment.apiUrl + '/softdev/issues/check-issue', { params }).pipe(mergeMap(validatedIssue => {

                if (validatedIssue.valid)
                    return of(new ClearAsyncErrorAction(controlId, validateIssueError), addValidatedIssue({ validatedIssue }));

                return of(new SetAsyncErrorAction(controlId, validateIssueError, "Issue invalid"), addValidatedIssue({ validatedIssue }));
            }), catchError(error => {
                console.log(error);
                return of(new SetAsyncErrorAction(controlId, validateIssueError, "Issue validation errored"));
            }))
        );
    }));
}


export function validateTms(store: Store<State>, http: HttpClient, validateTmsError: string, controlId: string, tms: string): Observable<any> {

    if (!tms)
        return of(new StartAsyncValidationAction(controlId, validateTmsError), new ClearAsyncErrorAction(controlId, validateTmsError));

    if (!new RegExp("^(([a-zA-Z0-9]+-\\d{5});*)*$").test(tms))
        return of(new StartAsyncValidationAction(controlId, validateTmsError), new SetAsyncErrorAction(controlId, validateTmsError, "Tms number invalid"));

    return store.select(getValidatedTms).pipe(delay(300), take(1), switchMap(validatedTms => {
        const alreadyValidatedTms = validatedTms.find(tv => tv.tms === tms);

        if (alreadyValidatedTms) {
            if (alreadyValidatedTms.valid)
                return of(new StartAsyncValidationAction(controlId, validateTmsError), new ClearAsyncErrorAction(controlId, validateTmsError));
            else
                return of(new StartAsyncValidationAction(controlId, validateTmsError), new SetAsyncErrorAction(controlId, validateTmsError, "Tms number invalid"));
        }

        let params = new HttpParams();
        params = params.append("tms", tms);

        return concat(
            of(new StartAsyncValidationAction(controlId, validateTmsError)),
            http.get<TmsValidation>(environment.apiUrl + '/softdev/tms/check-tms', { params }).pipe(mergeMap(validatedTms => {

                if (validatedTms.valid)
                    return of(new ClearAsyncErrorAction(controlId, validateTmsError), addValidatedTms({ validatedTms }));

                return of(new SetAsyncErrorAction(controlId, validateTmsError, "Tms number invalid"), addValidatedTms({ validatedTms }));
            }), catchError(error => {
                console.log(error);
                return of(new SetAsyncErrorAction(controlId, validateTmsError, "Tms validation errored"));
            }))
        );
    }));
}


export function validateFromId(store: Store<State>, http: HttpClient, validateFromIdError: string, controlId: string, fromId: string): Observable<any> {

    if (!fromId)
        return of(new StartAsyncValidationAction(controlId, validateFromIdError), new ClearAsyncErrorAction(controlId, validateFromIdError));

    if (new RegExp("^\\d").test(fromId))
        return of(new StartAsyncValidationAction(controlId, validateFromIdError), new SetAsyncErrorAction(controlId, validateFromIdError, "Invalid Id"));

    if (fromId.startsWith('ISS'))
        return validateIssue(store, http, validateFromIdError, controlId, fromId);

    if (fromId.startsWith('CR'))
        return validateCR(store, http, validateFromIdError, controlId, fromId);

    return validateTms(store, http, validateFromIdError, controlId, fromId);

}


export function validateProject(store: Store<State>, validateProjectError: string, controlId: string, projectName: string, clearVersionAction: Action, initVersionAction: Action): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Project invalid"), clearVersionAction);

    return store.select(getRedmineProjects).pipe(take(1), switchMap(projects => {

        if (projects.find(p => p.name == projectName))
            return of(new StartAsyncValidationAction(controlId, validateProjectError),
                new ClearAsyncErrorAction(controlId, validateProjectError), initVersionAction);

        return of(new StartAsyncValidationAction(controlId, validateProjectError),
            new SetAsyncErrorAction(controlId, validateProjectError, "Project invalid"), clearVersionAction);
    }));
}

export function validateItemsFromEmailsSettingsName(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, settingName: string): Observable<any> {
    if (!settingName)
        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Name invalid"));

    return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));
}