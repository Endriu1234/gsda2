import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationRoutingModule } from './communication-routing.module';
import { ChatPage } from './chat/pages/chat/chat.page';
import { NotificationsPage } from './notifications/pages/notifications/notifications.page';


@NgModule({
  declarations: [

  
    ChatPage,
        NotificationsPage
  ],
  imports: [
    CommonModule,
    CommunicationRoutingModule
  ]
})
export class CommunicationModule { }
