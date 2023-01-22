import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { PersonComponent } from "./person.component";
import { PersonResolver } from "../../core/resolver/person.resolver";
import { AuthGuard } from "../../core/guard/auth.guard";
import { UserResolver } from "../../core/resolver/user.resolver";

const routes: Routes = [
  {
    path: ':id',
    component: PersonComponent,
    canActivate: [AuthGuard],
    resolve: {
      person: PersonResolver,
      user: UserResolver,
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PersonRoutingModule { }
