import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventDetailedComponent} from "./event-detailed.component";
import {EventDetailedRoutingModule} from "./event-detailed-routing.module";
import {IonicModule} from "@ionic/angular";
import {HeaderModule} from "../../shared/header/header.module";
import {BasementModule} from "../../shared/basement/basement.module";
import {DirectiveModule} from "../../core/directive/directive.module";
import {PopupsModule} from "../../core/layer/popups/popups.module";
import {AsideEventModule} from "../../shared/aside-event/aside-event.module";



@NgModule({
  declarations: [
    EventDetailedComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    HeaderModule,
    PopupsModule,
    BasementModule,
    DirectiveModule,
    AsideEventModule,
    EventDetailedRoutingModule,
  ],
  exports: [
    EventDetailedComponent,
  ],
})
export class EventDetailedModule { }
