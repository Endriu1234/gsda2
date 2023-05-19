import { NgModule } from '@angular/core';
import { SmallSpinnerComponent } from '../spinner/small-spinner/small-spinner.component';

@NgModule({
  declarations: [
    SmallSpinnerComponent,
  ],
  exports: [
    SmallSpinnerComponent,
  ]
})

export class SmallSpinnerModule { }