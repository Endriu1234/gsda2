import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewEditPage } from './itemviewedit/pages/item-view-edit/item-view-edit.page';
import { ItemCreationPage } from './itemcreation/pages/item-creation/item-creation.page';
import { ItemsRoutingModule } from './items-routing.module';
import { MaterialModule } from '../shared/components/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgrxFormsModule } from 'ngrx-forms';
import { ItemCreationFromId } from './itemcreation/pages/item-creation-from-id/item-creation-from-id';
import { MatDialogModule } from '@angular/material/dialog';
import { BatchCreationSDCriteriaComponent } from './batchitemscreation/components/batch-creation-sdcriteria/batch-creation-sdcriteria.component';
import { BatchCreationTMSCriteriaComponent } from './batchitemscreation/components/batch-creation-tmscriteria/batch-creation-tmscriteria.component';
import { BatchCreationRedmineCriteriaComponent } from './batchitemscreation/components/batch-creation-redmine-criteria/batch-creation-redmine-criteria.component';
import { BatchItemsCreationPage } from './batchitemscreation/pages/batch-items-creation/batch-items-creation.page';
import { SmallSpinnerModule } from '../shared/components/small-spinner.module';



@NgModule({
  declarations: [
    BatchItemsCreationPage,
    ItemViewEditPage,
    ItemCreationPage,
    ItemCreationFromId,

    BatchCreationSDCriteriaComponent,
    BatchCreationTMSCriteriaComponent,
    BatchCreationRedmineCriteriaComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    MatDialogModule,
    SmallSpinnerModule

  ]
})
export class ItemsModule { }
