import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCreationPage } from './projectcreation/pages/project-creation/project-creation.page';
import { ProjectViewEditPage } from './projectviewedit/pages/project-view-edit/project-view-edit.page';

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }