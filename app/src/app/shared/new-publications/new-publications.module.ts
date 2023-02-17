import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPublicationsComponent } from "./new-publications.component";
import { IonicModule } from "@ionic/angular";
import { CreatePublicationModule } from "../create-publication/create-publication.module";
import { PipeModule } from "../../core/pipe/pipe.module";
import { RouterModule } from "@angular/router";
import { DirectiveModule } from "../../core/directive/directive.module";

@NgModule({
  declarations: [
    NewPublicationsComponent,
  ],
  exports: [
    NewPublicationsComponent,
  ],
  imports: [
    PipeModule,
    IonicModule,
    RouterModule,
    CommonModule,
    DirectiveModule,
    CreatePublicationModule,
  ]
})
export class NewPublicationsModule { }
