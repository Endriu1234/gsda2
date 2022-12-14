import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyPage } from './pages/daily/daily.page';

const routes: Routes = [
    {
        path: '',
        component: DailyPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DailyRoutingModule { }