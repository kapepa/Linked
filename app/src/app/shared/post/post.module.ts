import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from "./post.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    PostComponent,
  ],
  exports: [
    PostComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class PostModule { }
