import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideEventComponent} from "./aside-event.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    AsideEventComponent,
  ],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
  ],
  exports: [
    AsideEventComponent,
  ]
})
export class AsideEventModule { }
