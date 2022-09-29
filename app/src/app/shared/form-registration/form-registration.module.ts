import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRegistrationComponent } from "./form-registration.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    FormRegistrationComponent,
  ],
  exports: [
    FormRegistrationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class FormRegistrationModule { }
