import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapePostComponent } from "./tape-post.component";
import { PostModule } from "../post/post.module";
import { IonicModule } from "@ionic/angular";
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    TapePostComponent,
  ],
  exports: [
    TapePostComponent,
  ],
  imports: [
    CommonModule,
    PostModule,
    IonicModule,
    ScrollingModule
  ]
})
export class TapePostModule { }
