import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMainComponent } from "./nav-main.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";
import { RouterModule } from "@angular/router";
import { PopupFriendsModule } from "../popup-friends/popup-friends.module";

@NgModule({
  declarations: [
    NavMainComponent,
  ],
  exports: [
    NavMainComponent,
  ],
  imports: [
    PipeModule,
    CommonModule,
    IonicModule,
    RouterModule,
    PopupFriendsModule,
  ]
})
export class NavMainModule { }
