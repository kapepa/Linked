import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideEventComponent} from "./aside-event.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
<<<<<<< HEAD
import {DirectiveModule} from "../../core/directive/directive.module";

=======
>>>>>>> origin



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
>>>>>>> origin
  ],
  exports: [
    AsideEventComponent,
  ]
})
export class AsideEventModule { }
