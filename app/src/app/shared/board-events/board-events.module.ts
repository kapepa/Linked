import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardEventsComponent} from "./board-events.component";
import {IonicModule} from "@ionic/angular";
import {PipeModule} from "../../core/pipe/pipe.module";
import {DirectiveModule} from "../../core/directive/directive.module";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    BoardEventsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    DirectiveModule,
  ],
  exports: [
    BoardEventsComponent,
  ]
})
export class BoardEventsModule { }
