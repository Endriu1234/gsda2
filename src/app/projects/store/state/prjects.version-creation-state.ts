import { Boxed, FormGroupState, createFormGroupState, box } from "ngrx-forms";
import { RedmineProject } from "src/app/shared/store/models/redmine-project.model";
import { SoftDevProject } from "../models/softdev-project.model";

export const VERSION_CREATION_FORMID = "VERSION_CREATION_FORMID";

export interface VersionCreationSetupData {
    redmineProjectsFiltered: RedmineProject[];
    softdevProjectsFiltered: SoftDevProject[];
}

export function getVersionCreationSetupDataInitialState(): VersionCreationSetupData {
    return {
        redmineProjectsFiltered: [],
        softdevProjectsFiltered: []
    };
}

export interface VersionCreationFromData {
    redmine_project: string;
    sd_project: string;
    name: string;
    description: string;
    wiki_title: string;
    due_date: string;
    sharing: string;
    wiki: string;
}

export function getVersionCreationFromDataInitialState(): FormGroupState<VersionCreationFromData> {
    return createFormGroupState<VersionCreationFromData>(VERSION_CREATION_FORMID, {
        redmine_project: '',
        sd_project: '',
        name: '',
        description: '',
        wiki_title: '',
        due_date: '',
        sharing: 'descendants',
        wiki: ''
    });
}