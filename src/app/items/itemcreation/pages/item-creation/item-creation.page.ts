import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../app.reducer';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsersByLetter, setRedmineUsersByLetterFilter, setRedmineProjectsFilter } from '../../../store/items.actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineUserByLetter } from 'src/app/items/store/models/redmine-user-letter-model';
import { RedmineProject } from 'src/app/items/store/models/redmine-project.model';
import { Observable, take } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.page.html',
  styleUrls: ['./item-creation.page.scss']
})
export class ItemCreationPage implements OnInit {

  trackers$: Observable<RedmineTracker[]> | null = null;
  usersFiltered$: Observable<RedmineUserByLetter[]> | null = null;
  projects$: Observable<RedmineProject[]> | null = null;
  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  rmAutoProject = new FormControl('');
  rmAutoUser = new FormControl('');


  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit(): void {

    this.store.select(fromItemsSelectors.getRedmineTrackersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.trackers$ = this.store.select(fromItemsSelectors.getRedmineTrackers);

    this.store.select(fromItemsSelectors.getRedmineUsersByLetterLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineUsersByLetter());
    });

    this.usersFiltered$ = this.store.select(fromItemsSelectors.getRedmineUsersByLetterFiltered);

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromItemsSelectors.getRedmineProjectsFiltered);

    this.rmAutoUser.valueChanges
      .subscribe(redmineUsersByLetterFilter => {
        redmineUsersByLetterFilter
        this.store.dispatch(setRedmineUsersByLetterFilter({ redmineUsersByLetterFilter: { filter: redmineUsersByLetterFilter } }))
      });

      this.rmAutoProject.valueChanges
      .subscribe(redmineProjectsFilter => {
        redmineProjectsFilter
        this.store.dispatch(setRedmineProjectsFilter({ redmineProjectsFilter: { filter: redmineProjectsFilter } }))
      });
  }

}
