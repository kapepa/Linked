import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupPostComponent} from "./popup-post.component";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [
    PopupPostComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    PopupPostComponent,
  ],
})
export class PopupPostModule { }
