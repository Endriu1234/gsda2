import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { UiPreferencesPage } from './uipreferences/pages/ui-preferences/ui-preferences.page';
import { CachePage } from './cache/pages/cache/cache.page';
import { PrivilegesPage } from './privileges/pages/privileges/privileges.page';
import { MaterialModule } from '../shared/components/material/material.module';
import { NgrxFormsModule } from 'ngrx-forms';
import { SmallSpinnerModule } from '../shared/components/small-spinner.module';
import { EffectsModule } from '@ngrx/effects';
import { SetupEffects } from './store/effects/setup.effects';


@NgModule({
  declarations: [
    UiPreferencesPage,
    CachePage,
    PrivilegesPage
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    MaterialModule,
    NgrxFormsModule,
    SmallSpinnerModule,
    EffectsModule.forFeature([SetupEffects])
  ]
})
export class SetupModule { }
