import { AppComponent } from './app.component';
import { MaterialModule } from './shared/components/material/material.module';
import { HeaderComponent } from './navigation/components/header/header.component';
import { SidenavListComponent } from './navigation/components/sidenav-list/sidenav-list.component';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { WelcomePage } from './navigation/pages/welcome/welcome.page';
import { MenuSwitchComponent } from './navigation/components/menu-switch/menu-switch.component';
import { EffectsModule } from '@ngrx/effects';
import { ItemsEffects } from './items/store/items.effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { reducers } from './app.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ItemsEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
