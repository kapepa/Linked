import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileReaderComponent } from "./file-reader.component";



@NgModule({
  declarations: [
    FileReaderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    FileReaderComponent,
  ]
})
export class FileReaderModule { }
