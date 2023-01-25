import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsidePostComponent} from "./aside-post.component";



@NgModule({
  declarations: [
    AsidePostComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AsidePostComponent,
  ]
})
export class AsidePostModule { }
