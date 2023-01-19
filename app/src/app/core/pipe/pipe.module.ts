import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlPipe } from "./url.pipe";
import { ScrollPipe } from './scroll.pipe';



@NgModule({
  declarations: [
    UrlPipe,
    ScrollPipe,
  ],
  exports: [
    UrlPipe,
    ScrollPipe,
    CommonModule,
  ],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
