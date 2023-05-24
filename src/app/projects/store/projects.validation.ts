import { Store } from "@ngrx/store";
import { ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction } from "ngrx-forms";
import { Observable, catchError, concat, delay, mergeMap, of, switchMap, take } from "rxjs";
import { getRedmineProjects, getSoftDevProjects, getValidatedIdentifiers } from "./projects.selectors";
import { State } from "./projects.state";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { addValidatedIdentifier } from "./projects.actions";
import { IdentifierValidation } from "./models/identifier-validation.model";

export function validateProject(store: Store<State>, validateProjectError: string, controlId: string, projectName: string): Observable<any> {

    if (!projectName)
        return of(new StartAsyncValidationAction(controlId, validateProjectError), new ClearAsyncErrorAction(controlId, validateProjectError));

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

export function validateIdentifier(store: Store<State>, http: HttpClient, validateIdentifierError: string, controlId: string, identifier: string): Observable<any> {

    if (!identifier) {
        return of(new StartAsyncValidationAction(controlId, validateIdentifierError), new SetAsyncErrorAction(controlId, validateIdentifierError, "Identifier invalid"));
    }
    
    if (!new RegExp("^\\S+$").test(identifier))
        return of(new StartAsyncValidationAction(controlId, validateIdentifierError), new SetAsyncErrorAction(controlId, validateIdentifierError, "Identifier invalid"));

    return store.select(getValidatedIdentifiers).pipe(delay(300), take(1), switchMap(validatedIdentifiers => {
        const alreadyValidatedIdentifiers = validatedIdentifiers.find(iv => iv.identifier === identifier);

        if (alreadyValidatedIdentifiers) {
            if (alreadyValidatedIdentifiers.valid)
                return of(new StartAsyncValidationAction(controlId, validateIdentifierError), new ClearAsyncErrorAction(controlId, validateIdentifierError));
            else
                return of(new StartAsyncValidationAction(controlId, validateIdentifierError), new SetAsyncErrorAction(controlId, validateIdentifierError, "Identifier invalid"));
        }

        let params = new HttpParams();
        params = params.append("identifier", identifier);

        return concat(
            of(new StartAsyncValidationAction(controlId, validateIdentifierError)),
            http.get<IdentifierValidation>(environment.apiUrl + '/redmine/projects/check-identifier', { params }).pipe(mergeMap(validatedIdentifier => {

                if (validatedIdentifier.valid)
                    return of(new ClearAsyncErrorAction(controlId, validateIdentifierError), addValidatedIdentifier({ validatedIdentifier }));

                return of(new SetAsyncErrorAction(controlId, validateIdentifierError, "Identifier is not unique"), addValidatedIdentifier({ validatedIdentifier }));
            }), catchError(error => {
                console.log(error);
                return of(new SetAsyncErrorAction(controlId, validateIdentifierError, "Identifier validation errored"));
            }))
        );
    }));
}
