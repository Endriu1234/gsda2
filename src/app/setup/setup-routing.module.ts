import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CachePage } from './cache/pages/cache/cache.page';
import { PrivilegesPage } from './privileges/pages/privileges/privileges.page';
import { UiPreferencesPage } from './uipreferences/pages/ui-preferences/ui-preferences.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'uipreferences',
        pathMatch: 'full',
    },
    {
        path: 'uipreferences',
        component: UiPreferencesPage
    },
    {
        path: 'cache',
        component: CachePage
    },
    {
        path: 'privileges',
        component: PrivilegesPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SetupRoutingModule { }