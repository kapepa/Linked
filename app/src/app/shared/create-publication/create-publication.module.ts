import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePublicationComponent } from "./create-publication.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "../../core/pipe/pipe.module";
import { FileReaderModule } from "../file-reader/file-reader.module";
import { VideoReaderModule } from "../video-reader/video-reader.module";
import { RouterModule } from "@angular/router";
import { DirectiveModule } from "../../core/directive/directive.module";

@NgModule({
  declarations: [
    CreatePublicationComponent,
  ],
  exports: [
    CreatePublicationComponent,
  ],
  imports: [
    PipeModule,
    IonicModule,
    FormsModule,
    CommonModule,
    RouterModule,
    DirectiveModule,
    FileReaderModule,
    VideoReaderModule,
    ReactiveFormsModule,
  ]
})
export class CreatePublicationModule { }
