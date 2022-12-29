import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapePostComponent } from "./tape-post.component";
import { PostModule } from "../post/post.module";
import { IonicModule } from "@ionic/angular";
import { ScrollingModule } from '@angular/cdk/scrolling';
import {PipeModule} from "../../core/pipe/pipe.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    TapePostComponent,
  ],
  exports: [
    TapePostComponent,
  ],
  imports: [
    PostModule,
    PipeModule,
    IonicModule,
    CommonModule,
    RouterModule,
    ScrollingModule
  ]
})
export class TapePostModule { }
