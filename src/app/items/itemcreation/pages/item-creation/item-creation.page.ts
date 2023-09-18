import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromItemCreationSelectors from '../../../store/selectors/items.item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineUserByLetter } from 'src/app/shared/store/models/redmine-user-letter-model';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { ItemCreationFromId } from "../item-creation-from-id/item-creation-from-id";
import { MatDialog } from '@angular/material/dialog';
import { FormSaveState, FORM_SAVE_STATE } from 'src/app/shared/store/shared.state';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers } from 'src/app/items/store/actions/items.common-actions';
import { identifyAndFillItemById } from 'src/app/items/store/actions/items.item-creation-actions';
import { ITEM_CREATION_FORMID } from 'src/app/items/store/state/items.item-creation-state';

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
  getItemCreationFormSuitableForDefault$: Observable<boolean> | null = null;
  getItemCreationFormCanActivateSave$: Observable<boolean> | null = null;
  trimUpper = trimUpperConverter;

  constructor(private store: Store<fromItemsState.State>, private dialog: MatDialog) {
    this.formState$ = this.store.select(fromItemCreationSelectors.getItemCreationFormState);
  }

  openFromIdDialog(): void {
    const dialogRef = this.dialog.open(ItemCreationFromId, {
      width: '65%',
      disableClose: true,
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      restoreFocus: false
    });

  }

  fillById() {
    let fillFromId = false;
    this.getItemCreationFormSuitableForDefault$?.subscribe(val => fillFromId = val);
    if (!fillFromId) {
      this.openFromIdDialog();
    } else {
      let id: string = "";
      this.formState$.subscribe(formState => {
        if (formState.controls.issue && formState.controls.issue.value) {
          id = formState.controls.issue.value;
        } else if (formState.controls.cr && formState.controls.cr.value) {
          id = formState.controls.cr.value;
        } else if (formState.controls.tms && formState.controls.tms.value) {
          id = formState.controls.tms.value;
        }
      });
      this.store.dispatch(identifyAndFillItemById());
    }
  }

  ngOnInit(): void {

    this.store.select(fromCommonItemsSelectors.getRedmineTrackersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.trackers$ = this.store.select(fromCommonItemsSelectors.getRedmineTrackers);

    this.store.select(fromCommonItemsSelectors.getRedmineUsersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineUsers());
    });

    this.usersFiltered$ = this.store.select(fromItemCreationSelectors.getRedmineUsersByLetterFiltered);

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromItemCreationSelectors.getRedmineProjectsFilteredForItemCreation);

    this.getItemCreationFormSuitableForDefault$ = this.store.select(fromItemCreationSelectors.getItemCreationFormSuitableForDefault);
    this.getItemCreationFormCanActivateSave$ = this.store.select(fromItemCreationSelectors.getItemCreationFormCanActivateSave);
  }


  createItem() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }

  createAndOpenItem() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.SavingWithRedirect))
  }

}