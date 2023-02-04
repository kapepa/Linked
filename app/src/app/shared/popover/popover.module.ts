import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from "./popover.component";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";
import { BrowserModule } from "@angular/platform-browser";
import { DirectiveModule } from "../../core/directive/directive.module";



@NgModule({
  declarations: [
    PopoverComponent,
  ],
  exports: [
    PopoverComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule,
    PipeModule,
    DirectiveModule,
  ]
})
export class PopoverModule { }
