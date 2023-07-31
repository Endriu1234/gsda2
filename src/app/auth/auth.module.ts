import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login/login.page';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../shared/components/material';
import { NgrxFormsModule } from 'ngrx-forms';
import { DirectivesModule } from '../shared/directives/directives.module';
import { AuthEffects } from './store/auth.effects';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    NgrxFormsModule,
    DirectivesModule,
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class AuthModule { }
