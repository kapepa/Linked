import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPublicationsComponent } from "./new-publications.component";
import { IonicModule } from "@ionic/angular";
import { CreatePublicationModule } from "../create-publication/create-publication.module";
import { PipeModule } from "../../core/pipe/pipe.module";

@NgModule({
  declarations: [
    NewPublicationsComponent,
  ],
  exports: [
    NewPublicationsComponent,
  ],
  imports: [
    PipeModule,
    CommonModule,
    IonicModule,
    CreatePublicationModule,
  ]
})
export class NewPublicationsModule { }
