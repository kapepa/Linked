import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupCommentComponent } from "./popup-comment.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    PopupCommentComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class PopupCommentModule { }
