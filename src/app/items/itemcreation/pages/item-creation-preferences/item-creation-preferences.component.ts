import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs';
import * as fromItemCreationSelectors from "../../../store/selectors/items.item-creation-selectors";
import * as fromItemsState from '../../../store/state/items.state';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { loadItemCreationUserPreferencesSetup, saveItemCreationUserPreferences } from 'src/app/items/store/actions/items.item-creation-actions';

@Component({
  selector: 'app-item-creation-preferences',
  templateUrl: './item-creation-preferences.component.html',
  styleUrls: ['./item-creation-preferences.component.scss']
})
export class ItemCreationPreferencesComponent implements OnInit {

  dialogState$: Observable<FormGroupState<any>>;
  trimUpper = trimUpperConverter;

  constructor(private store: Store<fromItemsState.State>) {
    this.dialogState$ = this.store.select(fromItemCreationSelectors.getItemCreationUserPreferencesState);
  }

  ngOnInit(): void {
    this.store.dispatch(loadItemCreationUserPreferencesSetup());
  }

  CloseDialog() {
    this.store.dispatch(saveItemCreationUserPreferences({updateSetup: true}));
  }

}

