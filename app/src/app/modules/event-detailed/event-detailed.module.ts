import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventDetailedComponent} from "./event-detailed.component";



@NgModule({
  declarations: [
    EventDetailedComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    EventDetailedComponent,
  ]
})
export class EventDetailedModule { }
