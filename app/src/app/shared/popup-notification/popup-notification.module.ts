import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupNotificationComponent } from "./popup-notification.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    PopupNotificationComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class PopupNotificationModule { }
