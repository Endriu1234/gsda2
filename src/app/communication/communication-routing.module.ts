import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPage } from './chat/pages/chat/chat.page';
import { NotificationsPage } from './notifications/pages/notifications/notifications.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full',
    },
    {
        path: 'chat',
        component: ChatPage
    },
    {
        path: 'notifications',
        component: NotificationsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommunicationRoutingModule { }