import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainNewsComponent} from "./main-news.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {DirectiveModule} from "../../core/directive/directive.module";



@NgModule({
  declarations: [
    MainNewsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    DirectiveModule,
  ],
  exports: [
    MainNewsComponent,
  ]
})
export class MainNewsModule { }
