import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewEditPage } from './itemviewedit/pages/item-view-edit/item-view-edit.page';
import { ItemCreationPage } from './itemcreation/pages/item-creation/item-creation.page';
import { ItemsRoutingModule } from './items-routing.module';
import { BatchItemsCreationPage } from './batchitemscreation/pages/batch-items-creation/batch-items-creation.page';
import { MaterialModule } from '../shared/components/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgrxFormsModule } from 'ngrx-forms';
import { ItemCreationFromId } from './itemcreation/pages/item-creation-from-id/item-creation-from-id';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    BatchItemsCreationPage,
    ItemViewEditPage,
    ItemCreationPage,
    ItemCreationFromId
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    MatDialogModule
  ]
})
export class ItemsModule { }
