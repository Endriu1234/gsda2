import { createAction, props } from '@ngrx/store';

export const toggleSidenav = createAction('[Navigation Component] Toggle Sidenav');
export const toggleMenuItem = createAction('[Navigation Component] Toggle Menu item', props<{ index: number }>());
export const changeSidenavOpened = createAction('[Navigation Component] Change Sidenav Opened', props<{ opened: boolean }>());