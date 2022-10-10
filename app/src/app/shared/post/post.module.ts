import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from "./post.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";



@NgModule({
  declarations: [
    PostComponent,
  ],
  exports: [
    PostComponent,
  ],
  imports: [
    PipeModule,
    CommonModule,
    IonicModule,
  ]
})
export class PostModule { }
