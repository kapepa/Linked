import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from "./new.component";
import { UserResolver } from "../../core/resolver/user.resolver";
import { AuthGuard } from "../../core/guard/auth.guard";

const newCenterRoutes: Routes = [
  {
    path: '',
    component: NewComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(newCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class NewCenterRoutingModule { }
