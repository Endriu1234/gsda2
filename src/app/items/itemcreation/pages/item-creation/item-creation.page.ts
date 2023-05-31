import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/items.state';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { identifyAndFillItemById, initRedmineProjects, initRedmineTrackers, initRedmineUsers } from '../../../store/items.actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineUserByLetter } from 'src/app/items/store/models/redmine-user-letter-model';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { ItemCreationFromId } from "../item-creation-from-id/item-creation-from-id";
import { MatDialog } from '@angular/material/dialog';
import { FormSaveState, FORM_SAVE_STATE } from 'src/app/shared/store/shared.state';

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

    this.getItemCreationFormSuitableForDefault$ = this.store.select(fromItemsSelectors.getItemCreationFormSuitableForDefault);
    this.getItemCreationFormCanActivateSave$ = this.store.select(fromItemsSelectors.getItemCreationFormCanActivateSave);
  }


  createItem() {
    this.store.dispatch(new SetUserDefinedPropertyAction(fromItemsState.ITEM_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }

  createAndOpenItem() {
    this.store.dispatch(new SetUserDefinedPropertyAction(fromItemsState.ITEM_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.SavingWithRedirect))
  }

}