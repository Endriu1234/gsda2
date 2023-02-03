import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../app.reducer';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers, setRedmineUsersFilter } from '../../../store/items.actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { Observable, take } from 'rxjs';
import { RedmineUser } from 'src/app/items/store/models/redmine-user.model';
import { RedmineProject } from 'src/app/items/store/models/redmine-project.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.page.html',
  styleUrls: ['./item-creation.page.scss']
})
export class ItemCreationPage implements OnInit {

  trackers$: Observable<RedmineTracker[]> | null = null;
  usersFiltered$: Observable<RedmineUser[]> | null = null;
  projects$: Observable<RedmineProject[]> | null = null;
  myControl = new FormControl('');

  constructor(private store: Store<fromRoot.State>) { }

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

    this.usersFiltered$ = this.store.select(fromItemsSelectors.getRedmineUsersFiltered);

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projects$ = this.store.select(fromItemsSelectors.getRedmineProjects);

    this.myControl.valueChanges
      .subscribe(redmineUsersFilter => {
        redmineUsersFilter
        this.store.dispatch(setRedmineUsersFilter({ redmineUsersFilter: { filter: redmineUsersFilter } }))
      });

  }

}
