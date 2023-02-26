import { State } from './projects.state';
import * as _ from 'lodash';
import { RedmineProject } from './models/redmine-project.model';
import { RedmineProjectsFilter } from './models/redmine-project-filter';
import { SoftDevProject } from './models/softdev-project.model';
import { SoftDevProjectsFilter } from './models/softdev-project-filter';


export function initRedmineProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.projectCreation.redmineProjectsLoaded = false;
    return newState;
}

export function loadRedmineProjects(state: State, args: { redmineProjects: RedmineProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreation.redmineProjects = args.redmineProjects;
    newState.projectCreation.redmineProjectsFiltered = filterRedmineProjects(args.redmineProjects, newState.projectCreation.redmineProjectsFilter);
    newState.projectCreation.redmineProjectsLoaded = true;
    return newState;
}

export function setRedmineProjectsFilter(state: State, args: { redmineProjectsFilter: RedmineProjectsFilter }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreation.redmineProjectsFilter = args.redmineProjectsFilter;
    newState.projectCreation.redmineProjectsFiltered = filterRedmineProjects(newState.projectCreation.redmineProjects, args.redmineProjectsFilter);
    return newState;
}

function filterRedmineProjects(allProjects: RedmineProject[], filter: RedmineProjectsFilter): RedmineProject[] {
    if (filter.filter) {
        if (filter.filter instanceof RedmineProject)
            return [filter.filter];

        if (typeof filter.filter === 'string') {
            let filterStr: string = filter.filter;
            return allProjects.filter(u => u.name.toLocaleLowerCase().includes(filterStr.toLocaleLowerCase()));
        }
    }

    return allProjects;
}

export function initSoftDevProjects(state: State): State {
    const newState = _.cloneDeep(state);
    newState.projectCreation.softdevProjectsLoaded = false;
    return newState;
}

export function loadSoftDevProjects(state: State, args: { softdevProjects: SoftDevProject[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreation.softdevProjects = args.softdevProjects;
    newState.projectCreation.softdevProjectsFiltered = filterSoftDevProjects(args.softdevProjects, newState.projectCreation.softdevProjectsFilter);
    newState.projectCreation.softdevProjectsLoaded = true;
    return newState;
}

export function setSoftDevProjectsFilter(state: State, args: { softdevProjectsFilter: SoftDevProjectsFilter }): State {
    const newState: State = _.cloneDeep(state);
    newState.projectCreation.softdevProjectsFilter = args.softdevProjectsFilter;
    newState.projectCreation.softdevProjectsFiltered = filterSoftDevProjects(newState.projectCreation.softdevProjects, args.softdevProjectsFilter);
    return newState;
}

function filterSoftDevProjects(allProjects: SoftDevProject[], filter: SoftDevProjectsFilter): SoftDevProject[] {
    if (filter.filter) {
        if (filter.filter instanceof SoftDevProject)
            return [filter.filter];

        if (typeof filter.filter === 'string') {
            let filterStr: string = filter.filter;
            return allProjects.filter(u => u.PRODUCT_VERSION_NAME.toLocaleLowerCase().includes(filterStr.toLocaleLowerCase()));
        }
    }

    return allProjects;
}
