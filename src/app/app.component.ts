import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromNavigation from './navigation/store/navigation.reducer';
import { changeSidenavOpened } from './navigation/store/navigation.actions';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import * as fromShared from './shared/store/shared.reducer';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clearDisplayedSnackbarNotifications } from './shared/store/shared.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isSidenavOpened$: Observable<boolean>;
  readedNotificationTimestamp: number = 0;
  notificationSub: Subscription | null = null;
  notDisplayedNotifications: fromShared.SnackbarNotification[] = [];
  snackBarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;
  snackBarSub: Subscription | null = null;

  title = 'GSDA';

  constructor(private navigationStore: Store<fromNavigation.State>,
    private sharedStore: Store<fromShared.State>,
    private snackBar: MatSnackBar) {
    this.isSidenavOpened$ = this.navigationStore.select(fromNavigation.getSidenavOpened);
  }

  ngOnInit(): void {
    this.notificationSub = this.sharedStore.select(fromShared.getSnackbarNotifications).subscribe(notifications => {
      const newNotifications = notifications.filter(n => n.timestamp > this.readedNotificationTimestamp);

      for (let newNotification of newNotifications) {
        this.notDisplayedNotifications.push(newNotification);

        if (newNotification.timestamp > this.readedNotificationTimestamp)
          this.readedNotificationTimestamp = newNotification.timestamp;
      }

      if (this.notDisplayedNotifications.length > 0)
        this.runSnackbarLogic();
    });
  }

  runSnackbarLogic() {
    if (!this.snackBarRef) {
      const notification = this.notDisplayedNotifications.shift();

      if (notification) {
        this.snackBarRef = this.snackBar.open(notification.notification, 'OK', { duration: environment.snackbarDuration });

        this.snackBarSub = this.snackBarRef.afterDismissed().subscribe(() => {
          this.snackBarSub?.unsubscribe();
          this.snackBarSub = null;
          this.snackBarRef = null;

          this.runSnackbarLogic();
        });

        if (this.notDisplayedNotifications.length === 0)
          this.sharedStore.dispatch(clearDisplayedSnackbarNotifications({ timestamp: notification.timestamp }));
      }
    }
  }

  ngOnDestroy(): void {
    if (this.notificationSub)
      this.notificationSub.unsubscribe();
  }

  sidenavOpenedChange(opened: boolean) {
    this.navigationStore.dispatch(changeSidenavOpened({ opened }));
  }

}
