import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTapComponent } from "./message-tap.component";
import { MessageTapRoutingModule } from "./message-tap-routing.module";
import { ConversationModule } from "../../shared/conversation/conversation.module";
import { HeaderModule } from "../../shared/header/header.module";
import { IonicModule } from "@ionic/angular";
import { BasementModule } from "../../shared/basement/basement.module";

@NgModule({
  declarations: [
    MessageTapComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    HeaderModule,
    BasementModule,
    ConversationModule,
    MessageTapRoutingModule,
  ]
})
export class MessageTapModule { }
