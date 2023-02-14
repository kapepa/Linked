import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLoginComponent } from "./form-login.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { environment } from "../../../environments/environment";
import { SocialModule } from "../social/social.module";

@NgModule({
  declarations: [
    FormLoginComponent,
  ],
  exports: [
    FormLoginComponent,
  ],
  imports: [
    IonicModule,
    SocialModule,
    CommonModule,
    RecaptchaV3Module,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
  ],
})
export class FormLoginModule { }
