import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapeProfileComponent } from "./tape-profile.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    TapeProfileComponent,
  ],
  exports: [
    TapeProfileComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class TapeProfileModule { }
