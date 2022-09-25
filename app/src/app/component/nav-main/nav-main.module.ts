import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMainComponent } from "./nav-main.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    NavMainComponent,
  ],
  exports: [
    NavMainComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class NavMainModule { }
