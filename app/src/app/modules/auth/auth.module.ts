import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth-routing.module";
import { IonicModule } from "@ionic/angular";
import { FormLoginModule } from "../../shared/form-login/form-login.module";
import { FormRegistrationModule } from "../../shared/form-registration/form-registration.module";
import {BasementModule} from "../../shared/basement/basement.module";

@NgModule({
  declarations: [
    AuthComponent,
  ],
  exports: [
    AuthComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    BasementModule,
    FormLoginModule,
    AuthRoutingModule,
    FormRegistrationModule,
  ]
})
export class AuthModule { }
