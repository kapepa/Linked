import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "./chat.component";
import { ChatRoutingModule } from "./chat-routing.module";

@NgModule({
  declarations: [
    ChatComponent,
  ],
  exports: [
    ChatComponent,
    ChatRoutingModule
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
  ]
})
export class ChatModule { }
