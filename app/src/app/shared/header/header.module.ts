import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header.component";
import { IonicModule } from "@ionic/angular";
import { NavMainModule } from "../nav-main/nav-main.module";
import { RouterModule } from "@angular/router";

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
    RouterModule,
  ]
})
export class HeaderModule { }
