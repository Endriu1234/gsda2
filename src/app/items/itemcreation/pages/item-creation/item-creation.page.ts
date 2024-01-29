import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromItemCreationSelectors from '../../../store/selectors/items.item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { RedmineUserByLetter } from 'src/app/shared/store/models/redmine-user-letter-model';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { Observable, Subscription, map, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction, SetValueAction } from 'ngrx-forms';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { ItemCreationFromId } from "../item-creation-from-id/item-creation-from-id";
import { MatDialog } from '@angular/material/dialog';
import { FormSaveState, FORM_SAVE_STATE, SnackBarIcon } from 'src/app/shared/store/shared.state';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers } from 'src/app/items/store/actions/items.common-actions';
import { breakBatchItemCreation, identifyAndFillItemById } from 'src/app/items/store/actions/items.item-creation-actions';
import { ITEM_CREATION_FORMID } from 'src/app/items/store/state/items.item-creation-state';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import * as _ from 'lodash';
import { addSnackbarNotification } from 'src/app/shared/store/shared.actions';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.page.html',
  styleUrls: ['./item-creation.page.scss']
})
export class ItemCreationPage implements OnInit, OnDestroy {

  trackers$: Observable<RedmineTracker[]> | null = null;
  usersFiltered$: Observable<RedmineUserByLetter[]> | null = null;
  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  getItemCreationFormSuitableForDefault$: Observable<boolean> | null = null;
  getItemCreationFormCanActivateSave$: Observable<boolean> | null = null;
  isItemCreationFormCreatedFromBatch$: Observable<boolean> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;
  files$: Observable<File[]> | null = null;
  private subscriptions: (Subscription | undefined)[] = [];
  trimUpper = trimUpperConverter;
  @ViewChild("fileSelector", { static: false }) file_selector!: ElementRef;

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
    this.subscriptions.push(this.getItemCreationFormSuitableForDefault$?.subscribe(val => fillFromId = val));
    if (!fillFromId) {
      this.openFromIdDialog();
    } else {
      let id: string = "";
      this.subscriptions.push(this.formState$.subscribe(formState => {
        if (formState.controls.issue && formState.controls.issue.value) {
          id = formState.controls.issue.value;
        } else if (formState.controls.cr && formState.controls.cr.value) {
          id = formState.controls.cr.value;
        } else if (formState.controls.tms && formState.controls.tms.value) {
          id = formState.controls.tms.value;
        }
      }));
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
    this.isItemCreationFormCreatedFromBatch$ = this.store.select(fromItemCreationSelectors.isItemCreationFormCreatedFromBatch);
    this.versions$ = this.store.select(fromItemCreationSelectors.getRedmineVersionsByProject);
    this.files$ = this.store.select(fromItemCreationSelectors.getItemCreationFormFilestControl);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => { if (s) s.unsubscribe() });
  }

  createItem() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }

  createAndOpenItem() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEM_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.SavingWithRedirect))
  }

  breakBatchItemCreation() {
    this.store.dispatch(breakBatchItemCreation());
  }

  openFile() {
    const file_selection = this.file_selector.nativeElement;
    file_selection.click();
  }

  onChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.addFile(fileList);
    }

    element.value = '';
  }

  onPaste(event: any) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let tblFiles: File[] = [];
    let file: File;
    let txt: string  = '';

    for (const item of items) {
      file = item.getAsFile();
      if (file && this.validateFile(file)) {
        if (txt && txt.length > 0) {
          txt += '\n';
        }
        if (file.type.indexOf('image') === 0) {
          txt += '!' + file.name + '!';
        } else {
          txt += `See '${file.name}' attachment`
        }
        tblFiles.push(file);
      }
    }

    if (tblFiles.length > 0) {
      let textarea: HTMLTextAreaElement = event.target;
      let start = textarea.selectionStart;
      let end = textarea.selectionEnd;
      
      this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormDescriptionControl).pipe(take(1)).subscribe(descCtrl => {
        this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.description', descCtrl.value.substring(0,start) + txt + descCtrl.value.substring(end)));
      }));

      this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormFilestControl).pipe(take(1)).subscribe(fls => {
        tblFiles.unshift(...fls);
        this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.files', tblFiles));
      }));
    }
  }

  addFileToTextarea(event: FileList) {
    let tblFiles: File[] = [];
    let txt: string  = '';
    for (let index = 0; index < event.length; index++) {
      const file = event.item(index);
      if (file && this.validateFile(file)) {
        if (txt && txt.length > 0) {
          txt += '\n';
        }
        if (file.type.indexOf('image') === 0) {
          txt += '!' + file.name + '!';
        } else {
          txt += `See '${file.name}' attachment`
        }
        tblFiles.push(file);
      }
    }

    if (tblFiles.length > 0) {
      this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormDescriptionControl).pipe(take(1)).subscribe(descCtrl => {
        this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.description', descCtrl.value + txt));
      }));

      this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormFilestControl).pipe(take(1)).subscribe(fls => {
        tblFiles.unshift(...fls);
        this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.files', tblFiles));
      }));
    }
  }

  addFile(event: FileList) {
    let tblFiles: File[] = [];
    for (let index = 0; index < event.length; index++) {
      const file = event.item(index);
      if (file && this.validateFile(file)) {
        tblFiles.push(file);
      }
    }

    if (tblFiles.length > 0) {
      this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormFilestControl).pipe(take(1)).subscribe(fls => {
        tblFiles.unshift(...fls);
        this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.files', tblFiles));
      }));
    }
  }

  deleteFile(file: File) {

    this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormDescriptionControl).pipe(take(1)).subscribe(descCtrl => {
      let removeText = file.type.indexOf('image') === 0 ? '!' + file.name + '!' : `See '${file.name}' attachment`;
      this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.description', descCtrl.value.replace(new RegExp(removeText, 'g'), '')));
    }));
    
    this.subscriptions.push(this.store.select(fromItemCreationSelectors.getItemCreationFormFilestControl).pipe(take(1)).subscribe(fls => {
      let tblFile: File[] = fls.filter(item => item.name !== file.name);
      this.store.dispatch(new SetValueAction(ITEM_CREATION_FORMID + '.files', tblFile))
    }));
  }

  private validateFile(file: File): boolean {
    let bRet:boolean = true;

    if ((file.size/1024/1024) > 5) { //max 5MB
      this.store.dispatch(addSnackbarNotification({ 
        notification: "File: '" + file.name + "' cannot be uploaded because it exceeds the maximum allowed file size (5 MB)", 
        icon: SnackBarIcon.Info 
      }));
      bRet = false;
    }

    return bRet;
  }

}