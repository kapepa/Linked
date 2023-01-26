import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostEditionComponent} from "./post-edition.component";
import {IonicModule} from "@ionic/angular";
import {DirectiveModule} from "../../core/directive/directive.module";

@NgModule({
  declarations: [
    PostEditionComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    DirectiveModule,
  ],
  exports: [
    PostEditionComponent,
  ],
})
export class PostEditionModule { }
