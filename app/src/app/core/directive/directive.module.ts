import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImgDirective} from "./img.directive";

@NgModule({
  exports: [
    CommonModule,
    ImgDirective,
  ],
  declarations: [
    ImgDirective,
  ],
  imports: [
    CommonModule,
  ]
})
export class DirectiveModule { }
