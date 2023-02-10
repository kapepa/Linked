import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupPostComponent} from "./popup-post.component";
import {IonicModule} from "@ionic/angular";
import {DirectiveModule} from "../../core/directive/directive.module";
// import {GalleryModule} from "../gallery/gallery.module";

@NgModule({
  declarations: [
    PopupPostComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    // GalleryModule,
    DirectiveModule,
  ],
  exports: [
    PopupPostComponent,
  ],
})
export class PopupPostModule { }
