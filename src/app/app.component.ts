import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromNavigation from './navigation/store/navigation.reducer';
import { changeSidenavOpened } from './navigation/store/navigation.actions';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clearDisplayedSnackbarNotifications } from './shared/store/shared.actions';
import * as fromSharedState from './shared/store/shared.state';
import * as fromShared from './shared/store/shared.reducer';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  isSidenavOpened$: Observable<boolean>;
  isNotificationDisplayed: boolean = false;
  readedNotificationTimestamp: number = 0;
  notificationSub: Subscription | null = null;
  notDisplayedNotifications: fromSharedState.SnackbarNotification[] = [];

  title = 'GSDA';

  constructor(private navigationStore: Store<fromNavigation.State>,
    private sharedStore: Store<fromSharedState.State>) {
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
    if (!this.isNotificationDisplayed) {
      const notification = this.notDisplayedNotifications.shift();

      if (notification) {
        this.isNotificationDisplayed = true;
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom',
          //heightAuto: true,
          showConfirmButton: false,
          showCloseButton: true,
          timer: environment.snackbarDuration,
          timerProgressBar: true,
          customClass: {
            popup: 'colored-toast',
          },
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          },
          hideClass: {
            popup: 'animate__animated animate__flipOutX'
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          padding: '0.2em 0.2em 1em 0.2em'
        })

        Toast.fire({
          icon: notification.icon,
          title: '<div style="width: 50%; margin: 0px auto;">' + notification.icon.toUpperCase() + '</div>',
          html: notification.notification
        }).then(() => {
          this.isNotificationDisplayed = false;
          this.runSnackbarLogic();
        })

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
