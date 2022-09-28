import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePublicationComponent } from "./create-publication.component";
import {IonicModule} from "@ionic/angular";



@NgModule({
  declarations: [
    CreatePublicationComponent,
  ],
  exports: [
    CreatePublicationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class CreatePublicationModule { }
