import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRegistrationComponent } from "./form-registration.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import { environment } from "../../../environments/environment";

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
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
  ],
})
export class FormRegistrationModule { }
