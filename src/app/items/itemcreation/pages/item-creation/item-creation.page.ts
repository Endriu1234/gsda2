import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/items.state';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers } from '../../../store/items.actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineUserByLetter } from 'src/app/items/store/models/redmine-user-letter-model';
import { RedmineProject } from 'src/app/items/store/models/redmine-project.model';
import { Observable, take } from 'rxjs';
import { FormGroupState} from 'ngrx-forms';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { ItemCreationFromId} from "../item-creation-from-id/item-creation-from-id";
import { MatDialog } from '@angular/material/dialog';
import * as fromShared from '../../../../shared/store/shared.reducer';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.page.html',
  styleUrls: ['./item-creation.page.scss']
})
export class ItemCreationPage implements OnInit {

  trackers$: Observable<RedmineTracker[]> | null = null;
  usersFiltered$: Observable<RedmineUserByLetter[]> | null = null;
  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  trimUpper = trimUpperConverter;

  constructor(private store: Store<fromItemsState.State>, private sharedStore: Store<fromShared.State>, private dialog: MatDialog) {
    this.formState$ = this.store.select(fromItemsSelectors.getItemCreationFormState);
  }

  openFromIdDialog(): void {
    const dialogRef = this.dialog.open(ItemCreationFromId, {
      width: '65%',
      disableClose: true,
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {

    this.store.select(fromItemsSelectors.getRedmineTrackersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.trackers$ = this.store.select(fromItemsSelectors.getRedmineTrackers);

    this.store.select(fromItemsSelectors.getRedmineUsersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineUsers());
    });

    this.usersFiltered$ = this.store.select(fromItemsSelectors.getRedmineUsersByLetterFiltered);

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromItemsSelectors.getRedmineProjectsFiltered);
  }

  notifications = ['Notification 1', 'Notification 2', 'Notification 3', 'Notification 4', 'Notification 5', 'Notification 6', 'Notification 7', 'Notification 8'];

  createItem() {
    const nextNot = this.notifications.shift();
    if (nextNot)
      this.sharedStore.dispatch(addSnackbarNotification({ notification: nextNot }));
  }

  createAndOpenItem() {

  }

}

