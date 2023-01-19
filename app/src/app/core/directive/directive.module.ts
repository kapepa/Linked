import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgDirective } from "./img.directive";
import { ScrollDirective } from './scroll.directive';

@NgModule({
  declarations: [
    ImgDirective,
    ScrollDirective,
  ],
  exports: [
    CommonModule,
    ImgDirective,
    ScrollDirective,
  ],
  imports: [
    CommonModule,
  ],
})
export class DirectiveModule { }
