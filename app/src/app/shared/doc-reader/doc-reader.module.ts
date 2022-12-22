import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocReaderComponent } from "./doc-reader.component";



@NgModule({
  declarations: [
    DocReaderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DocReaderComponent,
  ]
})
export class DocReaderModule { }
