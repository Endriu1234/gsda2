import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../app.reducer';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers } from '../../../store/items.actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineUser } from 'src/app/items/store/models/redmine-user.model';
import { RedmineProject } from 'src/app/items/store/models/redmine-project.model';
import { Observable, take } from 'rxjs';
import { RedmineUser } from 'src/app/items/store/models/redmine-user.model';
import { RedmineProject } from 'src/app/items/store/models/redmine-project.model';
import {FormBuilder} from '@angular/forms';
import {startWith, map} from 'rxjs/operators'

export interface sdProject {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.page.html',
  styleUrls: ['./item-creation.page.scss']
})
export class ItemCreationPage implements OnInit {

  stateForm = this._formBuilder.group({
    sdProject: '',
  });

  sdProjects: sdProject[] = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas'],
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut'],
    },
    {
      letter: 'D',
      names: ['Delaware'],
    },
    {
      letter: 'F',
      names: ['Florida'],
    },
    {
      letter: 'G',
      names: ['Georgia'],
    },
    {
      letter: 'H',
      names: ['Hawaii'],
    },
    {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa'],
    },
    {
      letter: 'K',
      names: ['Kansas', 'Kentucky'],
    },
    {
      letter: 'L',
      names: ['Louisiana'],
    },
    {
      letter: 'M',
      names: [
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
      ],
    },
    {
      letter: 'N',
      names: [
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
      ],
    },
  ];

  sdProjectOptions: Observable<sdProject[]> | null = null;
  trackers$: Observable<RedmineTracker[]> | null = null;
  users$: Observable<RedmineUser[]> | null = null;
  projects$: Observable<RedmineProject[]> | null = null;


  constructor(private store: Store<fromRoot.State>,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.store.select(fromItemsSelectors.getRedmineTrackersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.trackers$ = this.store.select(fromItemsSelectors.getRedmineTrackers);

    this.sdProjectOptions = this.stateForm.get('sdProject')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value || '')),
    );
    this.store.select(fromItemsSelectors.getRedmineUsersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineUsers());
    });

    this.users$ = this.store.select(fromItemsSelectors.getRedmineUsers);

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projects$ = this.store.select(fromItemsSelectors.getRedmineProjects);
  }

  private _filterGroup(value: string): sdProject[] {
    if (value) {
      return this.sdProjects
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.sdProjects;
  }

}
