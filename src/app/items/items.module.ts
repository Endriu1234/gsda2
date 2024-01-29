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
import { BatchCreationIdscriteriaComponent } from './batchitemscreation/components/batch-creation-idscriteria/batch-creation-idscriteria.component';
import { EffectsModule } from '@ngrx/effects';
import { ItemsCommonEffects } from './store/effects/items.common-effects';
import { ItemsItemCreationEffects } from './store/effects/items.item-creation-effects';
import { ItemsBatchItemCreationEffects } from './store/effects/items.batch-item-creation-effects';
import { DirectivesModule } from '../shared/directives/directives.module';
import { ItemsFromEmailsPage } from './itemsfromemails/pages/items-from-emails/items-from-emails.page';
import { ItemsFromEmailsComponent } from './itemsfromemails/components/items-from-emails/items-from-emails.component';
import { ItemsFromEmailsSettingsComponent } from './itemsfromemails/components/items-from-emails-settings/items-from-emails-settings.component';
import { ItemsFromEmailsEffects } from './store/effects/items.items-from-emails-effects';



@NgModule({
  declarations: [
    BatchItemsCreationPage,
    ItemViewEditPage,
    ItemCreationPage,
    ItemCreationFromId,
    BatchCreationSDCriteriaComponent,
    BatchCreationTMSCriteriaComponent,
    BatchCreationRedmineCriteriaComponent,
    BatchCreationIdscriteriaComponent,
    ItemsFromEmailsPage,
    ItemsFromEmailsComponent,
    ItemsFromEmailsSettingsComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    MatDialogModule,
    SmallSpinnerModule,
    DirectivesModule,
    EffectsModule.forFeature([ItemsCommonEffects, ItemsItemCreationEffects, ItemsBatchItemCreationEffects, ItemsFromEmailsEffects])
  ]
})
export class ItemsModule { }
