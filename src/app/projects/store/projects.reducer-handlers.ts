import { State } from './state/projects.state';
import * as _ from 'lodash';
import { RedmineProject } from '../../shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';
import { filterRedmineProjects } from '../../shared/store/shared.reducer-handlers';


export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.projectsSetupData.redmineProjectsLoaded = false;
    return newState;
}

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectsSetupData.redmineProjects = args.redmineProjects;
    newState.projectCreationSetupData.redmineProjectsFiltered = filterRedmineProjects(args.redmineProjects, newState.projectCreationFromData.value.parent_project);
    newState.versionCreationSetupData.redmineProjectsFiltered = filterRedmineProjects(args.redmineProjects, newState.versionCreationFormData.value.redmine_project);
    newState.projectsSetupData.redmineProjectsLoaded = true;
    return newState;
}

export function setRedmineProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreationSetupData.redmineProjectsFiltered 
        = filterRedmineProjects(newState.projectsSetupData.redmineProjects, newState.projectCreationFromData.value.parent_project);
    return newState;
}

export function initSoftDevProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.projectsSetupData.softDevProjectsLoaded = false;
    return newState;
}

export function loadSoftDevProjects(state: State, args: { softdevProjects: SoftDevProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectsSetupData.softDevProjects = args.softdevProjects;
    newState.projectCreationSetupData.softdevProjectsFiltered = filterSoftDevProjects(args.softdevProjects, newState.projectCreationFromIdDialog.value.projectId);
    newState.versionCreationSetupData.softdevProjectsFiltered = filterSoftDevProjects(args.softdevProjects, newState.versionCreationFormData.value.sd_project);
    newState.projectsSetupData.softDevProjectsLoaded = true;
    return newState;
}

export function setSoftDevProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreationSetupData.softdevProjectsFiltered 
        = filterSoftDevProjects(newState.projectsSetupData.softDevProjects, newState.projectCreationFromIdDialog.value.projectId);
    return newState;
}

function filterSoftDevProjects(allProjects: SoftDevProject[], filter: string): SoftDevProject[] {
    if (filter) {
        return allProjects.filter(u => u.PRODUCT_VERSION_NAME.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    }

    return allProjects;
}

export function setVersionRedmineProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.versionCreationSetupData.redmineProjectsFiltered 
        = filterRedmineProjects(newState.projectsSetupData.redmineProjects, newState.versionCreationFormData.value.redmine_project);
    return newState;
}

export function setVersionSoftDevProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.versionCreationSetupData.softdevProjectsFiltered 
        = filterSoftDevProjects(newState.projectsSetupData.softDevProjects, newState.versionCreationFormData.value.sd_project);
    return newState;
}
