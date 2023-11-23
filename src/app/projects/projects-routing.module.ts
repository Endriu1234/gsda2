import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCreationPage } from './projectcreation/pages/project-creation/project-creation.page';
import { ProjectViewEditPage } from './projectviewedit/pages/project-view-edit/project-view-edit.page';
import { VersionCreationComponent } from './versioncreation/pages/version-creation/version-creation.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'projectcreation',
        pathMatch: 'full',
    },
    {
        path: 'projectcreation',
        component: ProjectCreationPage
    },
    {
        path: 'projectviewedit',
        component: ProjectViewEditPage
    },
    {
        path: 'versioncreation',
        component: VersionCreationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }