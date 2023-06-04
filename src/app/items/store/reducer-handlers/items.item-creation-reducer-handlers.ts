import * as _ from 'lodash';
import { filterRedmineProjects } from "src/app/shared/store/shared.reducer-handlers";
import { State } from "../items.state";
import { CRValidation } from '../models/cr-validation.model';
import { IssueValidation } from '../models/issue-validation.model';
import { TmsValidation } from '../models/tms-validation.model';
import { FromIdValidation } from '../models/fromId-validation.model';

export function setRedmineProjectsFilterForItemCreation(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.itemCreationFromData.value.project);
    return newState;
}

export function addValidatedCR(state: State, args: { validatedCR: CRValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedCRs.push(args.validatedCR);
    return newState;
}

export function addValidatedIssue(state: State, args: { validatedIssue: IssueValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedIssues.push(args.validatedIssue);
    return newState;
}

export function addValidatedTms(state: State, args: { validatedTms: TmsValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedTms.push(args.validatedTms);
    return newState;
}

export function addValidatedFromId(state: State, args: { validatedFromId: FromIdValidation }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.validatedFromId.push(args.validatedFromId);
    return newState;
}