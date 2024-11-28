import { createAction, props } from "@ngrx/store";

export const setSDOtherQueriesRecords = createAction('[Other Component] Set SoftDev Queries Records', props<{ rows: any[], columns: any[] }>());