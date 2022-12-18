import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostEditionComponent } from "./post-edition.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    PostEditionComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    PostEditionComponent,
  ]
})
export class PostEditionModule { }
