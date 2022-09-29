import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { FormLoginComponent } from "../../shared/form-login/form-login.component";
import { FormRegistrationComponent } from "../../shared/form-registration/form-registration.component";
import { AuthComponent } from "./auth.component";

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '', component: AuthComponent, children: [
      { path: 'login', component: FormLoginComponent },
      { path: 'registration', component: FormRegistrationComponent },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AuthRoutingModule { }
