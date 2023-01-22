import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapeFriendsComponent } from "./tape-friends.component";
import { IonicModule } from "@ionic/angular";
import {PipeModule} from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    TapeFriendsComponent,
  ],
  exports: [
    TapeFriendsComponent,
  ],
  imports: [
    PipeModule,
    IonicModule,
    CommonModule,
  ]
})
export class TapeFriendsModule { }
