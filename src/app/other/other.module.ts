import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/components/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgrxFormsModule } from 'ngrx-forms';
import { OtherRoutingModule } from './other-routing.module';
import { FindSupportGuysPage } from './findsupportguys/pages/find-support-guys/find-support-guys.page';
import { SoftdevQueriesComponent } from './softdevqueries/pages/softdev-queries/softdev-queries.component';
import { EffectsModule } from '@ngrx/effects';
import { OtherSDQueriesEffects } from './store/effects/other.sd-queries-effects';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  declarations: [
  
    FindSupportGuysPage,
    SoftdevQueriesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    OtherRoutingModule,
    MatTableExporterModule,
    EffectsModule.forFeature([OtherSDQueriesEffects])
  ]
})
export class OtherModule { }
