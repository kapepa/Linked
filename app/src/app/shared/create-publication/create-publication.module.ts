import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePublicationComponent } from "./create-publication.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    CreatePublicationComponent,
  ],
  exports: [
    CreatePublicationComponent,
  ],
  imports: [
    PipeModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class CreatePublicationModule { }
