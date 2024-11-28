import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindSupportGuysPage } from './findsupportguys/pages/find-support-guys/find-support-guys.page';
import { SoftdevQueriesComponent } from './softdevqueries/pages/softdev-queries/softdev-queries.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'findsupportguys',
        pathMatch: 'full',
    },
    {
        path: 'findsupportguys',
        component: FindSupportGuysPage
    },
    {
        path: 'softdevqueries',
        component: SoftdevQueriesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherRoutingModule { }