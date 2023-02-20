import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCreationPage } from './projectcreation/pages/project-creation/project-creation.page';
import { ProjectViewEditPage } from './projectviewedit/pages/project-view-edit/project-view-edit.page';
import { ProjectsRoutingModule } from './projects-routing.module';
import { MaterialModule } from '../shared/components/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProjectCreationPage,
    ProjectViewEditPage
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ProjectsModule { }
