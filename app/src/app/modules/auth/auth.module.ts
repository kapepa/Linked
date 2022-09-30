import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth-routing.module";
import { IonicModule } from "@ionic/angular";
import { FormLoginModule } from "../../shared/form-login/form-login.module";
import { FormRegistrationModule } from "../../shared/form-registration/form-registration.module";

@NgModule({
  declarations: [
    AuthComponent,
  ],
  exports: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    IonicModule,
    FormLoginModule,
    FormRegistrationModule,
  ]
})
export class AuthModule { }
