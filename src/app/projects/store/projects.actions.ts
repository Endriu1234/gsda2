import { createAction, props } from '@ngrx/store';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { SoftDevProject } from './models/softdev-project.model';
import { IdentifierValidation } from './models/identifier-validation.model';

export const initRedmineProjects = createAction('[Projects Component] Init Redmine Projects');
export const loadRedmineProjects = createAction('[Projects Component] Load Redmine Projects', props<{ redmineProjects: RedmineProject[] }>());
export const setRedmineProjectsFilter = createAction('[Projects Component] Set Redmine Projects Filter');
export const initSoftDevProjects = createAction('[Projects Component] Init SoftDev Projects');
export const loadSoftDevProjects = createAction('[Projects Component] Load SoftDev Projects', props<{ softdevProjects: SoftDevProject[] }>());
export const setSoftDevProjectsFilter = createAction('[Projects Component] Set SoftDev Projects Filter');
export const fillProjectById = createAction('[Projects Component] Find Project By Id');
export const resetProjectCreationForm = createAction('[Projects Component] Reset Project Creation From');
export const addValidatedIdentifier = createAction('[Projects Component] Add Validated Identifier', props<{ validatedIdentifier: IdentifierValidation }>());
export const setVersionRedmineProjectsFilter = createAction('[Projects Component] Set Version Redmine Projects Filter');
export const setVersionSoftDevProjectsFilter = createAction('[Projects Component] Set Version SoftDev Projects Filter');
export const setVersionDataBaseonSDProject = createAction('[Projects Component] Set Version Data Base On SoftDev Project');
export const resetVersionCreationForm = createAction('[Projects Component] Reset Version Creation Form');
export const noopAction = createAction('[Projects Component] Noop Action');
