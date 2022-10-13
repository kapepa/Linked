import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonRoutingModule } from "./person-routing.module";
import { PersonComponent } from "./person.component";
import { HeaderModule } from "../../shared/header/header.module";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    PersonComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    HeaderModule,
    PersonRoutingModule,
  ]
})
export class PersonModule { }
