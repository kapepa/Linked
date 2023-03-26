import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {NotFoundComponent} from "./not-found.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    NotFoundComponent
  ]
})
export class NotFoundModule { }
