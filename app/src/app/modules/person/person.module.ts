import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonRoutingModule } from "./person-routing.module";
import { PersonComponent } from "./person.component";
import { HeaderModule } from "../../shared/header/header.module";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../../core/pipe/pipe.module";
import { BasementModule } from "../../shared/basement/basement.module";
import { DirectiveModule } from "../../core/directive/directive.module";

@NgModule({
  declarations: [
    PersonComponent
  ],
  imports: [
    PipeModule,
    IonicModule,
    CommonModule,
    HeaderModule,
    BasementModule,
    DirectiveModule,
    PersonRoutingModule,
  ],
})
export class PersonModule { }
