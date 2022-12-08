import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from "./conversation.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "../../core/pipe/pipe.module";



@NgModule({
  declarations: [
    ConversationComponent,
  ],
  imports: [
    PipeModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ConversationComponent,
  ]
})
export class ConversationModule { }
