import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { getItemsFromEmailsSettingsFormData } from 'src/app/items/store/selectors/items.items-from-emails-selectors';
import * as fromItemsState from '../../../store/state/items.state';
import { FORM_SAVE_STATE, FormSaveState } from 'src/app/shared/store/shared.state';
import { ITEMS_FROM_EMAILS_SETTINGS_FORMID } from 'src/app/items/store/state/items.items-from-emails-state';
import { initItemsFromEmailsSettings } from 'src/app/items/store/actions/items.items-from-emails.actions';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import * as fromItemsFromEmailsSelectors from '../../../store/selectors/items.items-from-emails-selectors';
import { initRedmineProjects, initRedmineTrackers } from 'src/app/items/store/actions/items.common-actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';

@Component({
  selector: 'app-items-from-emails-settings',
  templateUrl: './items-from-emails-settings.component.html',
  styleUrls: ['./items-from-emails-settings.component.scss']
})
export class ItemsFromEmailsSettingsComponent implements OnInit {

  formState$: Observable<FormGroupState<any>>;
  trackers$: Observable<RedmineTracker[]> | null = null;
  projectsFiltered$: Observable<RedmineProject[]> | null = null;


  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(getItemsFromEmailsSettingsFormData);
    this.store.dispatch(initItemsFromEmailsSettings());
  }

  ngOnInit(): void {
    this.store.select(fromCommonItemsSelectors.getRedmineTrackersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });


    this.trackers$ = this.store.select(fromCommonItemsSelectors.getRedmineTrackers);
    this.projectsFiltered$ = this.store.select(fromItemsFromEmailsSelectors.getRedmineProjectsFilteredForItemsFromEmail);
  }


  saveSettings() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_SETTINGS_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }
}
