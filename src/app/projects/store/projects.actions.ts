import { createAction, props } from '@ngrx/store';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';

export const initRedmineProjects = createAction('[Projects Component] Init Redmine Projects');
export const loadRedmineProjects = createAction('[Projects Component] Load Redmine Projects', props<{ redmineProjects: RedmineProject[] }>());
export const setRedmineProjectsFilter = createAction('[Projects Component] Set Redmine Projects Filter');
export const initSoftDevProjects = createAction('[Projects Component] Init SoftDev Projects');
export const loadSoftDevProjects = createAction('[Projects Component] Load SoftDev Projects', props<{ softdevProjects: SoftDevProject[] }>());
export const setSoftDevProjectsFilter = createAction('[Projects Component] Set SoftDev Projects Filter');
export const findProjectById = createAction('[Projects Component] Find Project By Id', props<{ id: string }>());
export const noopAction = createAction('[Projects Component] Noop Action');