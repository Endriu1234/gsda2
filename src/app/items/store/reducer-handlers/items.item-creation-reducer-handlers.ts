import * as _ from 'lodash';
import { filterRedmineProjects } from "src/app/shared/store/shared.reducer-handlers";
import { State } from "../state/items.state";
import { CRValidation } from '../models/cr-validation.model';
import { IssueValidation } from '../models/issue-validation.model';
import { TmsValidation } from '../models/tms-validation.model';
import { FromIdValidation } from '../models/fromId-validation.model';
import { ItemCreationMode } from '../state/items.item-creation-state';
import { RedmineVersion } from '../../../shared/store/models/redmine-version.model';
import { FileToUpload } from 'src/app/shared/store/models/file-to-upload.model';

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

export function startResetItemCreationForm(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.resetInProgress = true;
    return newState;
}

export function endResetItemCreationForm(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.resetInProgress = false;
    return newState;
}

export function setItemCreationFormMode(state: State, args: { mode: ItemCreationMode }): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.mode = args.mode;
    return newState;
}

export function initRedmineVersions(state: State): State {
    const newState = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersions(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    console.dir(args.redmineVersions);
    newState.itemCreationSetupData.redmineVersions = args.redmineVersions;
    newState.itemCreationSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersions(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.itemCreationSetupData.redmineVersions = [];
    newState.itemCreationSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function addFilesToUpload(state: State, args: {filesToUpload: File[]}): State {
    const newState: State = _.cloneDeep(state);

    if (args.filesToUpload && args.filesToUpload.length > 0) {
        for (let index = 0; index < args.filesToUpload.length; index++) {
            const fileToUpload = args.filesToUpload[index];
            if (fileToUpload.type && fileToUpload.type.length > 0) {
                let selected_file: FileToUpload = {
                    file: fileToUpload,
                    isUploadInProgress: false,
                    upload_error: '',
                    upload_success: false,
                    id: newState.itemCreationFiles.files.length
                  };
                newState.itemCreationFiles.files.push(selected_file);
            }
        }
    }
    
    return newState;
}

export function deleteFile(state: State, args: {fileToDeleteId: number}): State {
    const newState: State = _.cloneDeep(state);

    newState.itemCreationFiles.files = newState.itemCreationFiles.files.filter(item => item.id !== args.fileToDeleteId);
    
    return newState;
}

export function updateFiles(state: State, args: {fileToUpload: FileToUpload[]}): State {
    const newState: State = _.cloneDeep(state);

    console.dir(args.fileToUpload);
    
    return newState;
}

