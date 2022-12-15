import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupCommentComponent } from "./popup-comment.component";
import { IonicModule } from "@ionic/angular";
import { CommentModule } from "../comment/comment.module";



@NgModule({
  declarations: [
    PopupCommentComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    CommentModule,
  ]
})
export class PopupCommentModule { }
