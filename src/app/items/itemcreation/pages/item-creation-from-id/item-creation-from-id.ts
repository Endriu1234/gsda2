import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState} from 'ngrx-forms';
import { Observable} from 'rxjs';
import * as fromItemsSelectors from "../../../store/items.selectors";
import * as fromItemsState from '../../../store/items.state';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { findItemById } from '../../../store/items.actions';

@Component({
  selector: 'app-item-creation-from-id',
  templateUrl: './item-creation-from-id.html',
  styleUrls: ['./item-creation-from-id.scss']
})

export class ItemCreationFromId implements OnInit {

  dialogState$: Observable<FormGroupState<any>>;
  trimUpper = trimUpperConverter;

  constructor (private store: Store<fromItemsState.State>) {
    this.dialogState$ = this.store.select(fromItemsSelectors.getItemCreationDialogState); 
  }

  ngOnInit(): void {
  }

  fillById() {
    let id = "";
    this.dialogState$.subscribe(group => id = group.controls.fromId.value);
    this.store.dispatch(findItemById({id}));
  }

}
