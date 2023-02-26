import { createAction, props } from '@ngrx/store';
import { RedmineProject } from './models/redmine-project.model';
import { RedmineProjectsFilter } from './models/redmine-project-filter';
import { SoftDevProject } from './models/softdev-project.model';
import { SoftDevProjectsFilter } from './models/softdev-project-filter';

export const initRedmineProjects = createAction('[Items Component] Init Redmine Projects');
export const loadRedmineProjects = createAction('[Items Component] Load Redmine Projects', props<{ redmineProjects: RedmineProject[] }>());
export const setRedmineProjectsFilter = createAction('[Items Component] Set Redmine Projects Filter', props<{ redmineProjectsFilter: RedmineProjectsFilter }>());
export const initSoftDevProjects = createAction('[Projects Component] Init SoftDev Projects');
export const loadSoftDevProjects = createAction('[Projects Component] Load SoftDev Projects', props<{ softdevProjects: SoftDevProject[] }>());
export const setSoftDevProjectsFilter = createAction('[Projects Component] Set SoftDev Projects Filter', props<{ softdevProjectsFilter: SoftDevProjectsFilter }>());