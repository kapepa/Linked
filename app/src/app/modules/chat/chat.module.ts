import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "./chat.component";
import { ChatRoutingModule } from "./chat-routing.module";
import { IonicModule } from "@ionic/angular";
import { HeaderModule } from "../../shared/header/header.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "../../core/pipe/pipe.module";
import { TapeFriendsModule } from "../../shared/tape-friends/tape-friends.module";

@NgModule({
  declarations: [
    ChatComponent,
  ],
  exports: [
    ChatComponent,
    ChatRoutingModule,
    TapeFriendsModule,
  ],
  imports: [
    PipeModule,
    IonicModule,
    HeaderModule,
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ChatModule { }
