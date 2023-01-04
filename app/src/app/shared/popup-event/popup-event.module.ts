import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupEventComponent } from "./popup-event.component";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    PopupEventComponent
  ],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
  ]
})
export class PopupEventModule { }
