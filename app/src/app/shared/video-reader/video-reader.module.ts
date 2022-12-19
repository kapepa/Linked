import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoReaderComponent } from "./video-reader.component";



@NgModule({
  declarations: [
    VideoReaderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    VideoReaderComponent,
  ]
})
export class VideoReaderModule { }
