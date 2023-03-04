import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormGroupState} from 'ngrx-forms';
import { Observable, take } from 'rxjs';
import * as fromRoot from '../../../../app.reducer';
import * as fromItemsSelectors from "../../../store/items.selectors";
import * as fromItemsState from '../../../store/items.state';
import { trimUpperConverter } from '../../../../shared/tools/validators/ngrxValueConverters';

@Component({
  selector: 'app-item-creation-from-id',
  templateUrl: './item-creation-from-id.html',
  styleUrls: ['./item-creation-from-id.scss']
})
export class ItemCreationFromId implements OnInit {

  formState$: Observable<FormGroupState<any>>;
  trimUpper = trimUpperConverter;

  constructor (private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromItemsSelectors.getItemCreationFormState); 
  }

  ngOnInit(): void {
  }

    

}
