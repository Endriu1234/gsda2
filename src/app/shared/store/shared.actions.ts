import { createAction, props } from '@ngrx/store';
import { SnackBarIcon } from './shared.state';

export const addSnackbarNotification = createAction('[Shared Component] Add Snackbar Notification', props<{ notification: string, icon: SnackBarIcon }>());
export const clearDisplayedSnackbarNotifications = createAction('[Shared Component] Clear Displayed Snackbar Notifications', props<{ timestamp: number }>());
export const openLinkInNewWindow = createAction('[Shared Component] Open Link in New Window', props<{ url: string }>());
export const noopAction = createAction('[Shared Component] Noop Action');