import { Action, Store } from "@ngrx/store";
import { ClearAsyncErrorAction, SetAsyncErrorAction, SetValueAction, StartAsyncValidationAction } from "ngrx-forms";
import { State } from "./state/items.state";
import { catchError, concat, delay, from, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CRValidation } from "./models/cr-validation.model";
import { IssueValidation } from "./models/issue-validation.model";
import { TmsValidation } from "./models/tms-validation.model";
import { environment } from 'src/environments/environment';
import { addValidatedCR, addValidatedIssue, addValidatedTms } from "./actions/items.item-creation-actions";
import { getRedmineProjects, getRedmineUsers } from "./selectors/items.common-selectors";
import { getValidatedCRs, getValidatedIssues, getValidatedTms } from "./selectors/items.item-creation-selectors";
import { getItemsFromEmailsSettingsFormData, getItemsFromEmailsSettingsFormWithSetup, getItemsFromEmailsSettingsFormWithSetupAndAllGridData, getItemsFromEmailsSettingsFormWithSetupAndTrackers } from "./selectors/items.items-from-emails-selectors";
import { ITEMS_FROM_EMAILS_SETTINGS_FORMID } from "./state/items.items-from-emails-state";
import { clearRedmineVersionsForItemsFromEmail, initRedmineVersionsForItemsFromEmail } from "./actions/items.items-from-emails.actions";


export function validateUser(store: Store<State>, validateUserError: string, controlId: string, userName: string, required: boolean): Observable<any> {

    if (!userName) {
        if (required)
            return of(new StartAsyncValidationAction(controlId, validateUserError), new SetAsyncErrorAction(controlId, validateUserError, "User invalid"));

        return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));
    }
    return store.select(getRedmineUsers).pipe(take(1), switchMap(users => {
        if (users.find(u => u.name == userName))
            return of(new StartAsyncValidationAction(controlId, validateUserError), new ClearAsyncErrorAction(controlId, validateUserError));

        return of(new StartAsyncValidationAction(controlId, validateUserError), new SetAsyncErrorAction(controlId, validateUserError, "User invalid"));
    }));
}

export function validateUserForItemsFromEmails(store: Store<State>, validateUserError: string, controlId: string, userName: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(settingsFormData => {
        if (!settingsFormData.formData.value.type || settingsFormData.formData.value.type == 'attach') {
            return of(new StartAsyncValidationAction(controlId, validateUserError),
                new ClearAsyncErrorAction(controlId, validateUserError));
        }

        return validateUser(store, validateUserError, controlId, userName, true);
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


export function validateProjectForItemsFromEmails(store: Store<State>, validateProjectError: string, controlId: string, projectName: string, clearVersionAction: Action, initVersionAction: Action): Observable<any> {
    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(settingsFormData => {
        if (!settingsFormData.formData.value.type || settingsFormData.formData.value.type == 'attach') {
            return of(new StartAsyncValidationAction(controlId, validateProjectError),
                new ClearAsyncErrorAction(controlId, validateProjectError), clearVersionAction);
        }

        return validateProject(store, validateProjectError, controlId, projectName, clearVersionAction, initVersionAction);
    }));
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

    return store.select(getItemsFromEmailsSettingsFormWithSetupAndAllGridData).pipe(take(1), switchMap(settingsData => {
        const nameOccurenceInGrid = settingsData.gridData.records.filter(p => p.name === settingName).length;
        let retVal = false;

        if (settingsData.formSetup.editedSetting) {
            if (settingsData.formSetup.editedSetting.name === settingsData.formData.value.name)
                retVal = nameOccurenceInGrid === 1;
            else
                retVal = nameOccurenceInGrid === 0;
        }
        else
            retVal = nameOccurenceInGrid === 0;

        if (retVal)
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Name invalid"));
    }));

}

export function validateItemsFromEmailsSettingsFindIssues(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, findIssues: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(settingsData => {

        if (!settingsData.formData.value.type || settingsData.formData.value.type === 'attach' || findIssues === 'none' || findIssues === 'latest' || findIssues === 'earliest' || findIssues === 'all')
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Find Issues invalid"));
    }));
}

export function validateItemsFromEmailsSettingsFindCRs(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, findCRs: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(settingsData => {

        if (!settingsData.formData.value.type || settingsData.formData.value.type === 'attach' || findCRs === 'none' || findCRs === 'latest' || findCRs === 'earliest' || findCRs === 'all')
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Find CRs invalid"));
    }));
}

export function validateItemsFromEmailsSettingsCloseItemsAfterAttach(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, closeItemsAfterAttach: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(settingsData => {

        if (settingsData.formData.value.type === 'create' || closeItemsAfterAttach === 'none' || closeItemsAfterAttach === 'latest' || closeItemsAfterAttach === 'earliest' || closeItemsAfterAttach === 'all')
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError),
            new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Close Items After Attach invalid"));
    }));
}

export function validateItemsFromEmailsSettingsTracker(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, tracker: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetupAndTrackers).pipe(take(1), switchMap(settingsData => {

        if (!settingsData.formData.value.type || settingsData.formData.value.type === 'attach' || settingsData.trackers.filter(t => t.name === tracker).length === 1)
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError),
            new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Tracker invalid"));
    }));
}

export function validateItemsFromEmailsSettingsSendAttachResultTo(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, sendAttachResultTo: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(settingsData => {

        if (!settingsData.formData.value.type || settingsData.formData.value.type === 'create' || sendAttachResultTo === 'none' || sendAttachResultTo === 'sender' || sendAttachResultTo === 'all')
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Send Attach Result To invalid"));
    }));
}


export function validateItemsFromEmailsSettingsParsingMode(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, parsingMode: string): Observable<any> {
    return store.select(getItemsFromEmailsSettingsFormData).pipe(take(1), switchMap(settingsData => {

        if (!settingsData.value.type || parsingMode === 'plain' || parsingMode === 'plainAndHtmlAttachment' || parsingMode === 'parsedHtml')
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new SetAsyncErrorAction(controlId, validateItemsFromEmailsError, "Parsing Mode invalid"));
    }));
}

export function validateItemsFromEmailsSettingsType(store: Store<State>, validateItemsFromEmailsError: string, controlId: string, settingType: string): Observable<any> {

    return store.select(getItemsFromEmailsSettingsFormWithSetup).pipe(take(1), switchMap(form => {
        if (!settingType || !(settingType === 'create' || settingType === 'attach' || settingType === 'both'))
            return of(new StartAsyncValidationAction(controlId, validateItemsFromEmailsError), new ClearAsyncErrorAction(controlId, validateItemsFromEmailsError));

        const postValidationActions: any[] = [];

        if (settingType === 'both') {
            return concat(
                validateItemsFromEmailsSettingsName(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.name', form.formData.value.name),
                validateItemsFromEmailsSettingsParsingMode(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.parsingMode', form.formData.value.parsingMode),
                validateItemsFromEmailsSettingsTracker(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.tracker', form.formData.value.tracker),
                validateUserForItemsFromEmails(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.user', form.formData.value.user),
                validateItemsFromEmailsSettingsFindIssues(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.findIssues', form.formData.value.findIssues),
                validateItemsFromEmailsSettingsFindCRs(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.findCRs', form.formData.value.findCRs),
                validateItemsFromEmailsSettingsCloseItemsAfterAttach(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.closeItemsAfterAttach', form.formData.value.closeItemsAfterAttach),
                validateItemsFromEmailsSettingsSendAttachResultTo(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.sendAttachResultTo', form.formData.value.sendAttachResultTo),
                validateProjectForItemsFromEmails(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.project',
                    form.formData.value.project, clearRedmineVersionsForItemsFromEmail(), initRedmineVersionsForItemsFromEmail({ projectName: form.formData.value.project }))
            );
        }
        else if (settingType === 'create') {
            postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.closeItemsAfterAttach', ''));
            postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.sendAttachResultTo', ''));

            return concat(
                from(postValidationActions),
                validateItemsFromEmailsSettingsName(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.name', form.formData.value.name),
                validateItemsFromEmailsSettingsParsingMode(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.parsingMode', form.formData.value.parsingMode),
                validateItemsFromEmailsSettingsTracker(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.tracker', form.formData.value.tracker),
                validateUserForItemsFromEmails(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.user', form.formData.value.user),
                validateItemsFromEmailsSettingsFindIssues(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.findIssues', form.formData.value.findIssues),
                validateItemsFromEmailsSettingsFindCRs(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.findCRs', form.formData.value.findCRs),
                validateProjectForItemsFromEmails(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.project',
                    form.formData.value.project, clearRedmineVersionsForItemsFromEmail(), initRedmineVersionsForItemsFromEmail({ projectName: form.formData.value.project }))
            );
        }

        //attach..

        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.version', ''));
        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.project', ''));
        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.user', ''));
        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.findIssues', ''));
        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.findCRs', ''));
        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.tracker', ''));
        postValidationActions.push(new SetValueAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.addAttachments', false));

        return concat(
            from(postValidationActions),
            validateItemsFromEmailsSettingsName(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.name', form.formData.value.name),
            validateItemsFromEmailsSettingsCloseItemsAfterAttach(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.closeItemsAfterAttach', form.formData.value.closeItemsAfterAttach),
            validateItemsFromEmailsSettingsSendAttachResultTo(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.sendAttachResultTo', form.formData.value.sendAttachResultTo),
            validateItemsFromEmailsSettingsParsingMode(store, validateItemsFromEmailsError, ITEMS_FROM_EMAILS_SETTINGS_FORMID + '.parsingMode', form.formData.value.parsingMode)

        );
    }));
}
