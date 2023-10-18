import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { getItemsFromEmailsGeneralSettingsFormData } from 'src/app/items/store/selectors/items.items-from-emails-selectors';
import * as fromItemsState from '../../../store/state/items.state';
import { FORM_SAVE_STATE, FormSaveState } from 'src/app/shared/store/shared.state';
import { ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID } from 'src/app/items/store/state/items.items-from-emails-state';
import { initItemsFromEmailsGeneralSettings } from 'src/app/items/store/actions/items.items-from-emails.actions';
@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent {

  formState$: Observable<FormGroupState<any>>;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(getItemsFromEmailsGeneralSettingsFormData);
    this.store.dispatch(initItemsFromEmailsGeneralSettings());
  }


  saveSettings() {
    this.store.dispatch(new SetUserDefinedPropertyAction(ITEMS_FROM_EMAILS_GENERAL_SETTINGS_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }
}
