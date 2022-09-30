import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRegistrationComponent } from "./form-registration.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";

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
    ReactiveFormsModule,
  ]
})
export class FormRegistrationModule { }
