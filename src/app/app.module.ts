import { AppComponent } from './app.component';
import { MaterialModule } from './shared/components/material/material.module';
import { HeaderComponent } from './navigation/components/header/header.component';
import { SidenavListComponent } from './navigation/components/sidenav-list/sidenav-list.component';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { WelcomePage } from './navigation/pages/welcome/welcome.page';
import { MenuSwitchComponent } from './navigation/components/menu-switch/menu-switch.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { reducers } from './app.reducer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SmallSpinnerModule } from './shared/components/small-spinner.module';
import { httpInterceptProviders } from './shared/components/interceptors-providers.module';
import { SharedEffects } from './shared/store/shared.effects';
import { ProgressBarSpinnerComponent } from './shared/spinner/progress-bar/progress-bar-spinner/progress-bar-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    WelcomePage,
    MenuSwitchComponent,
    SpinnerComponent,
    ProgressBarSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    SmallSpinnerModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([SharedEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 1000, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 1000, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),

  ],
  providers: [httpInterceptProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
