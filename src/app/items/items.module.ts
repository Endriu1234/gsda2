import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewEditPage } from './itemviewedit/pages/item-view-edit/item-view-edit.page';
import { ItemCreationPage } from './itemcreation/pages/item-creation/item-creation.page';
import { ItemsRoutingModule } from './items-routing.module';
import { BatchItemsCreationPage } from './batchitemscreation/pages/batch-items-creation/batch-items-creation.page';



@NgModule({
  declarations: [
    BatchItemsCreationPage,
    ItemViewEditPage,
    ItemCreationPage
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule
  ]
})
export class ItemsModule { }
