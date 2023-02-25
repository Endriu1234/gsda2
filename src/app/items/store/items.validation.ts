import { Store } from "@ngrx/store";
import { ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction, ValidationErrors } from "ngrx-forms";
import { State } from "./items.state";
import { getRedmineProjects, getRedmineUsers, getValidatedCRs } from "./items.selectors";
import { catchError, concat, delay, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CRValidation } from "./models/cr-validation.model";
import { addValidatedCR } from "./items.actions";

export const validateUserError = "validateUserError";

export function validateUser(store: Store<State>, controlId: string, userName: string): Observable<any> {

    if (!userName)
        return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

    return store.select(getRedmineUsers).pipe(take(1), switchMap(users => {
        if (users.find(u => u.name == userName))
            return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

        return of(new StartAsyncValidationAction(controlId, validateUserError), new SetAsyncErrorAction(controlId, validateUserError, "User invalid"));
    }));
}

export const validateCRError = "validateCRError";

export function validateCR(store: Store<State>, http: HttpClient, controlId: string, cr: string): Observable<any> {

    if (!cr)
        return of(new StartAsyncValidationAction(controlId, validateCRError), new ClearAsyncErrorAction(controlId, validateCRError));

    if (!new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(cr))
        return of(new StartAsyncValidationAction(controlId, validateCRError), new SetAsyncErrorAction(controlId, validateCRError, "CR invalid"));

    let params = new HttpParams();
    params = params.append("cr", cr);

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
            http.get<CRValidation>('http://localhost:3000/api/softdev/crs/check-cr', { params }).pipe(mergeMap(validatedCR => {

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

export const validateProjectError = "validateProjectError";

export function validateProject(store: Store<State>, controlId: string, projectName: string): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Project invalid"));

    return store.select(getRedmineProjects).pipe(take(1), switchMap(users => {
        if (users.find(u => u.name == projectName))
            return of(new StartAsyncValidationAction(controlId, validateProjectError), new ClearAsyncErrorAction(controlId, validateProjectError));

        return of(new StartAsyncValidationAction(controlId, validateProjectError), new SetAsyncErrorAction(controlId, validateProjectError, "Project invalid"));
    }));
}