import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "./chat.component";
import { ChatRoutingModule } from "./chat-routing.module";
import { IonicModule } from "@ionic/angular";
import { HeaderModule } from "../../shared/header/header.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    ChatComponent,
  ],
  exports: [
    ChatComponent,
    ChatRoutingModule
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
