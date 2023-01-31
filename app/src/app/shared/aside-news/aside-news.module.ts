import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideNewsComponent} from "./aside-news.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {DirectiveModule} from "../../core/directive/directive.module";



@NgModule({
  declarations: [
    AsideNewsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    DirectiveModule,
  ],
  exports: [
    AsideNewsComponent,
  ]
})
export class AsideNewsModule { }
