import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapeFriendsComponent } from "./tape-friends.component";

@NgModule({
  declarations: [
    TapeFriendsComponent,
  ],
  exports: [
    TapeFriendsComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class TapeFriendsModule { }
