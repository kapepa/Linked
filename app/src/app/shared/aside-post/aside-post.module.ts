import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsidePostComponent} from "./aside-post.component";
import {DirectiveModule} from "../../core/directive/directive.module";



@NgModule({
  declarations: [
    AsidePostComponent,
  ],
  imports: [
    CommonModule,
    DirectiveModule,
  ],
  exports: [
    AsidePostComponent,
  ]
})
export class AsidePostModule { }
