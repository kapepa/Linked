import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalleryComponent} from "./gallery.component";
import {SlickCarouselModule} from "ngx-slick-carousel";

@NgModule({
  declarations: [
    GalleryComponent,
  ],
  imports: [
    CommonModule,
    SlickCarouselModule,
  ],
  exports: [
    GalleryComponent,
  ]
})

export class GalleryModule { }
