import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasementComponent } from "./basement.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    BasementComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    BasementComponent,
  ]
})
export class BasementModule { }
