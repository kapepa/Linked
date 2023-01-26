import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideEventComponent} from "./aside-event.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {DirectiveModule} from "../../core/directive/directive.module";



@NgModule({
  declarations: [
    AsideEventComponent,
  ],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
    DirectiveModule,
  ],
  exports: [
    AsideEventComponent,
  ]
})
export class AsideEventModule { }
