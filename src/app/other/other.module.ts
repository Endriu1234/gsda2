import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherRoutingModule } from './other-routing.module';
import { FindSupportGuysPage } from './findsupportguys/pages/find-support-guys/find-support-guys.page';



@NgModule({
  declarations: [
  
    FindSupportGuysPage
  ],
  imports: [
    CommonModule,
    OtherRoutingModule
  ]
})
export class OtherModule { }
