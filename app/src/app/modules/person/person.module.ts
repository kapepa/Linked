import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonRoutingModule } from "./person-routing.module";
import { PersonComponent } from "./person.component";
import { HeaderModule } from "../../shared/header/header.module";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    PersonComponent
  ],
  imports: [
    PipeModule,
    IonicModule,
    CommonModule,
    HeaderModule,
    PersonRoutingModule,
  ]
})
export class PersonModule { }
