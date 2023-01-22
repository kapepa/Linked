import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideEventComponent} from "./aside-event.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
<<<<<<< HEAD
import {DirectiveModule} from "../../core/directive/directive.module";
=======
>>>>>>> 2f2490c84c31548508b2502ba84af8ad11d1431e



@NgModule({
  declarations: [
    AsideEventComponent,
  ],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
<<<<<<< HEAD
    DirectiveModule,
=======
>>>>>>> 2f2490c84c31548508b2502ba84af8ad11d1431e
  ],
  exports: [
    AsideEventComponent,
  ]
})
export class AsideEventModule { }
