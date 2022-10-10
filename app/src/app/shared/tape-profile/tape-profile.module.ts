import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapeProfileComponent } from "./tape-profile.component";
import { IonicModule } from "@ionic/angular";
import { DirectiveModule } from "../../core/directive/directive.module";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    TapeProfileComponent,
  ],
  exports: [
    TapeProfileComponent
  ],
  imports: [
    PipeModule,
    CommonModule,
    IonicModule,
    DirectiveModule,
  ]
})
export class TapeProfileModule { }
