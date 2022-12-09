import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsTapComponent } from "./friends-tap.component";
import { IonicModule } from "@ionic/angular";
import { TapeFriendsModule } from "../../shared/tape-friends/tape-friends.module";
import { HeaderModule } from "../../shared/header/header.module";
import { BasementModule } from "../../shared/basement/basement.module";

@NgModule({
  declarations: [
    FriendsTapComponent,
  ],
  imports: [
    IonicModule,
    HeaderModule,
    CommonModule,
    BasementModule,
    TapeFriendsModule,
  ],
  exports: [
    FriendsTapComponent,
  ]
})
export class FriendsTapModule { }
