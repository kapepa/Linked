import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header.component";
import { IonicModule } from "@ionic/angular";
import { NavMainModule } from "../nav-main/nav-main.module";

@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    NavMainModule,
  ]
})
export class HeaderModule { }
