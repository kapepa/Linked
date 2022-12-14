import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from "./comment.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    CommentComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class CommentModule { }
