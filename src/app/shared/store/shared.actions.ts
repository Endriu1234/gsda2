import { createAction, props } from '@ngrx/store';

export const addSnackbarNotification = createAction('[Shared Component] Add Snackbar Notification', props<{ notification: string }>());
export const clearDisplayedSnackbarNotifications = createAction('[Shared Component] Clear Displayed Snackbar Notifications', props<{ timestamp: number }>());