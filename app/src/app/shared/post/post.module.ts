import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from "./post.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";
import { RouterModule } from "@angular/router";
import { DirectiveModule } from "../../core/directive/directive.module";



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
    RouterModule,
    DirectiveModule,
  ]
})
export class PostModule { }
