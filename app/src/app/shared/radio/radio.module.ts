import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioComponent } from "./radio.component";
import { IonicModule } from "@ionic/angular";


@NgModule({
  declarations: [
    RadioComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    RadioComponent,
  ]
})
export class RadioModule { }
