import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SocialComponent} from "./social.component";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [
    SocialComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    SocialComponent,
  ]
})
export class SocialModule { }
