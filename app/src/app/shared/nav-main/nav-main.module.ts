import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMainComponent } from "./nav-main.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    NavMainComponent,
  ],
  exports: [
    NavMainComponent,
  ],
  imports: [
    PipeModule,
    CommonModule,
    IonicModule,
  ]
})
export class NavMainModule { }
