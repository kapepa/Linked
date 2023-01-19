import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from "./event.component";
import { EventRoutingModule } from "./event-routing.module";
import { IonicModule } from "@ionic/angular";
import { HeaderModule } from "../../shared/header/header.module";
import { BasementModule } from "../../shared/basement/basement.module";
import { PopupsModule } from "../../core/layer/popups/popups.module";
import { DirectiveModule } from "../../core/directive/directive.module";
import { BoardEventsModule } from "../../shared/board-events/board-events.module";

@NgModule({
  declarations: [
    EventComponent,
  ],
  imports: [
    IonicModule,
    HeaderModule,
    CommonModule,
    PopupsModule,
    BasementModule,
    DirectiveModule,
    BoardEventsModule,
    EventRoutingModule,
  ],
  exports: [
    EventComponent,
  ]
})
export class EventModule { }
