import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupFriendsComponent } from "./popup-friends.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    PopupFriendsComponent,
  ],
  imports: [
    PipeModule,
    IonicModule,
    CommonModule,
  ]
})
export class PopupFriendsModule { }
