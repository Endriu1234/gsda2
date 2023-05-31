import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCreationPage } from './projectcreation/pages/project-creation/project-creation.page';
import { ProjectViewEditPage } from './projectviewedit/pages/project-view-edit/project-view-edit.page';
import { ProjectsRoutingModule } from './projects-routing.module';
import { MaterialModule } from '../shared/components/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgrxFormsModule } from 'ngrx-forms';
import { ProjectCreationFromId } from './projectcreation/pages/project-creation-from-id/project-creation-from-id';
import { MatDialogModule } from '@angular/material/dialog';
import { SmallSpinnerModule } from '../shared/components/small-spinner.module';
import { EffectsModule } from '@ngrx/effects';
import { ProjectsEffects } from './store/projects.effects';


@NgModule({
  declarations: [
    ProjectCreationPage,
    ProjectViewEditPage,
    ProjectCreationFromId
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    MatDialogModule,
    SmallSpinnerModule,
    EffectsModule.forFeature([ProjectsEffects]),
  ]
})
export class ProjectsModule { }
