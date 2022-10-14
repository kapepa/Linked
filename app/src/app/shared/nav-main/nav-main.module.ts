import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMainComponent } from "./nav-main.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";
import { RouterModule } from "@angular/router";

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
    RouterModule,
  ]
})
export class NavMainModule { }
