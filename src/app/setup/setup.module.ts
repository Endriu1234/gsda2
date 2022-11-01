import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { UiPreferencesPage } from './uipreferences/pages/ui-preferences/ui-preferences.page';
import { CachePage } from './cache/pages/cache/cache.page';
import { PrivilegesPage } from './privileges/pages/privileges/privileges.page';



@NgModule({
  declarations: [
    UiPreferencesPage,
    CachePage,
    PrivilegesPage
  ],
  imports: [
    CommonModule,
    SetupRoutingModule
  ]
})
export class SetupModule { }
