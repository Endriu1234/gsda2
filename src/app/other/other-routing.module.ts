import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindSupportGuysPage } from './findsupportguys/pages/find-support-guys/find-support-guys.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'findsupportguys',
        pathMatch: 'full',
    },
    {
        path: 'findsupportguys',
        component: FindSupportGuysPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherRoutingModule { }