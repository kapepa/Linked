import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupFriendsComponent } from "./popup-friends.component";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [
    PopupFriendsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class PopupFriendsModule { }
