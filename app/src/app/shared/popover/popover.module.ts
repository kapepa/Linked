import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from "./popover.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    PopoverComponent,
  ],
  exports: [
    PopoverComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class PopoverModule { }
