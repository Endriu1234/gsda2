import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/components/material/material.module';
import { HeaderComponent } from './navigation/components/header/header.component';
import { SidenavListComponent } from './navigation/components/sidenav-list/sidenav-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { AppRoutingModule } from './app-routing.module';
import { WelcomePage } from './navigation/pages/welcome/welcome.page';
import { MenuSwitchComponent } from './navigation/components/menu-switch/menu-switch.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    WelcomePage,
    MenuSwitchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    StoreModule.forRoot(reducers),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
