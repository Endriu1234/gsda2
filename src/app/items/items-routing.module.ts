import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchItemsCreationPage } from './batchitemscreation/pages/batch-items-creation/batch-items-creation.page';
import { ItemCreationPage } from './itemcreation/pages/item-creation/item-creation.page';
import { ItemViewEditPage } from './itemviewedit/pages/item-view-edit/item-view-edit.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'itemcreation',
        pathMatch: 'full',
    },
    {
        path: 'itemcreation',
        component: ItemCreationPage
    },
    {
        path: 'batchitemscreation',
        component: BatchItemsCreationPage
    },
    {
        path: 'itemviewedit',
        component: ItemViewEditPage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemsRoutingModule { }