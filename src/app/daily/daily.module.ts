import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyRoutingModule } from './daily-routing.module';
import { DailyPage } from './pages/daily/daily.page';


@NgModule({
  declarations: [
    DailyPage
  ],
  imports: [
    CommonModule,
    DailyRoutingModule
  ]
})
export class DailyModule { }
