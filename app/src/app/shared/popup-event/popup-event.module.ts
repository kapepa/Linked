import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupEventComponent } from "./popup-event.component";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileReaderModule } from "../file-reader/file-reader.module";
import { CheckboxModule } from "../checkbox/checkbox.module";
import { RadioModule } from "../radio/radio.module";



@NgModule({
  declarations: [
    PopupEventComponent
  ],
  imports: [
    IonicModule,
    RadioModule,
    FormsModule,
    RouterModule,
    CommonModule,
    CheckboxModule,
    FileReaderModule,
    ReactiveFormsModule,
  ]
})
export class PopupEventModule { }
