import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlPipe } from "./url.pipe";



@NgModule({
  declarations: [
    UrlPipe
  ],
  exports: [
    UrlPipe,
    CommonModule,
  ],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
