import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from "./comment.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    CommentComponent
  ],
  imports: [
    PipeModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommentComponent,
  ]
})
export class CommentModule { }
