import { State } from './projects.state';
import * as _ from 'lodash';
import { RedmineProject } from '../../shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';
import { filterRedmineProjects } from '../../shared/store/shared.reducer-handlers';


export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.projectCreationSetupData.redmineProjectsLoaded = false;
    return newState;
}

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreationSetupData.redmineProjects = args.redmineProjects;
    newState.projectCreationSetupData.redmineProjectsFiltered = filterRedmineProjects(args.redmineProjects, newState.projectCreationFromData.value.redmineProject);
    newState.projectCreationSetupData.redmineProjectsLoaded = true;
    return newState;
}

export function setRedmineProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreationSetupData.redmineProjectsFiltered 
        = filterRedmineProjects(newState.projectCreationSetupData.redmineProjects, newState.projectCreationFromData.value.redmineProject);
    return newState;
}

export function initSoftDevProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.projectCreationSetupData.softdevProjectsLoaded = false;
    return newState;
}

export function loadSoftDevProjects(state: State, args: { softdevProjects: SoftDevProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreationSetupData.softdevProjects = args.softdevProjects;
    newState.projectCreationSetupData.softdevProjectsFiltered = filterSoftDevProjects(args.softdevProjects, newState.projectCreationFromIdDialog.value.projectId);
    newState.projectCreationSetupData.softdevProjectsLoaded = true;
    return newState;
}

export function setSoftDevProjectsFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreationSetupData.softdevProjectsFiltered 
        = filterSoftDevProjects(newState.projectCreationSetupData.softdevProjects, newState.projectCreationFromIdDialog.value.projectId);
    return newState;
}

function filterSoftDevProjects(allProjects: SoftDevProject[], filter: string): SoftDevProject[] {
    if (filter) {
        return allProjects.filter(u => u.PRODUCT_VERSION_NAME.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    }

    return allProjects;
}
