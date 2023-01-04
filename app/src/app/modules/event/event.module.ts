import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from "./event.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    EventComponent,
  ],
  imports: [
    RouterModule.forChild([
      {path: '', component: EventComponent},
    ]),
    CommonModule,
  ],
  exports: [
    EventComponent,
  ]
})
export class EventModule { }
