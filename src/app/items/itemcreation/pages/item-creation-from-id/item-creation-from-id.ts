import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs';
import * as fromItemCreationSelectors from "../../../store/selectors/items.item-creation-selectors";
import * as fromItemsState from '../../../store/items.state';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';
import { fillItemById } from 'src/app/items/store/actions/items.item-creation-actions';

@Component({
  selector: 'app-item-creation-from-id',
  templateUrl: './item-creation-from-id.html',
  styleUrls: ['./item-creation-from-id.scss']
})

export class ItemCreationFromId implements OnInit {

  dialogState$: Observable<FormGroupState<any>>;
  trimUpper = trimUpperConverter;

  constructor(private store: Store<fromItemsState.State>) {
    this.dialogState$ = this.store.select(fromItemCreationSelectors.getItemCreationDialogState);
  }

  ngOnInit(): void {
  }

  fillById() {

    this.store.dispatch(fillItemById());
  }

}
