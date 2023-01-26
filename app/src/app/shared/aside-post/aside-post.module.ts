import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsidePostComponent} from "./aside-post.component";
import {DirectiveModule} from "../../core/directive/directive.module";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";



@NgModule({
  declarations: [
    AsidePostComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    DirectiveModule,
  ],
  exports: [
    AsidePostComponent,
  ]
})
export class AsidePostModule { }
