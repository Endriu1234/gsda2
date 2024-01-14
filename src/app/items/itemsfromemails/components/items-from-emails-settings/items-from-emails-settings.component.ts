import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { getItemsFromEmailsSettingsFormData } from 'src/app/items/store/selectors/items.items-from-emails-selectors';
import * as fromItemsState from '../../../store/state/items.state';
import { FORM_SAVE_STATE, FormSaveState } from 'src/app/shared/store/shared.state';
import { ITEMS_FROM_EMAILS_SETTINGS_FORMID } from 'src/app/items/store/state/items.items-from-emails-state';
import { initItemsFromEmailsSettings } from 'src/app/items/store/actions/items.items-from-emails.actions';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import * as fromItemsFromEmailsSelectors from '../../../store/selectors/items.items-from-emails-selectors';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers } from 'src/app/items/store/actions/items.common-actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { RedmineUserByLetter } from 'src/app/shared/store/models/redmine-user-letter-model';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { MatTableDataSource } from '@angular/material/table';
import { ItemsFromEmailsSettings } from 'src/app/items/store/models/itemsfromemails/items-from-emails-settings.model';

@Component({
  selector: 'app-items-from-emails-settings',
  templateUrl: './items-from-emails-settings.component.html',
  styleUrls: ['./items-from-emails-settings.component.scss']
})
export class ItemsFromEmailsSettingsComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<any>>;
  trackers$: Observable<RedmineTracker[]> | null = null;
  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  usersFiltered$: Observable<RedmineUserByLetter[]> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;
  getItemsFromEmailsSettingsCanActivateSave$: Observable<boolean> | null = null;
  dataSource: MatTableDataSource<ItemsFromEmailsSettings> = new MatTableDataSource<ItemsFromEmailsSettings>([]);
  recordsSubscription: Subscription | null = null;
  expandedElement: ItemsFromEmailsSettings | null = null;
  allColumns$: Observable<string[]> | null = null;
  columnsLength$: Observable<number> | null = null;




  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(getItemsFromEmailsSettingsFormData);
  }

  ngOnInit(): void {
    this.recordsSubscription = this.store.select(fromItemsFromEmailsSelectors.getItemsFromEmailsSettingsGridData).subscribe(data => {
      this.dataSource.data = data.records;
    });

    this.store.select(fromCommonItemsSelectors.getRedmineTrackersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.store.select(fromCommonItemsSelectors.getRedmineUsersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineUsers());
    });

    this.columnsLength$ = this.store.select(fromItemsFromEmailsSelectors.getItemsFromEmailsSettingsGridColumnsLength);

    this.trackers$ = this.store.select(fromCommonItemsSelectors.getRedmineTrackers);
    this.projectsFiltered$ = this.store.select(fromItemsFromEmailsSelectors.getRedmineProjectsFilteredForItemsFromEmail);
    this.versions$ = this.store.select(fromItemsFromEmailsSelectors.getRedmineVersionsByProject);
    this.usersFiltered$ = this.store.select(fromItemsFromEmailsSelectors.getRedmineUsersByLetterFiltered);
    this.getItemsFromEmailsSettingsCanActivateSave$ = this.store.select(fromItemsFromEmailsSelectors.getItemsFromEmailsSettingsCanActivateSave);
    this.allColumns$ = this.store.select(fromItemsFromEmailsSelectors.getItemsFromEmailsSettingsColumns);




    this.store.dispatch(initItemsFromEmailsSettings());

  }

  ngOnDestroy(): void {
    this.recordsSubscription?.unsubscribe();
  }


  saveSettings() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator)
    //   this.dataSource.paginator.firstPage();
  }
}
