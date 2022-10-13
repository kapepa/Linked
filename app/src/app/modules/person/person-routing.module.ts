import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { PersonComponent } from "./person.component";
import { PersonResolver } from "../../core/resolver/person.resolver";
import { AuthGuard } from "../../core/guard/auth.guard";

const routes: Routes = [
  {
    path: ':id',
    component: PersonComponent,
    canActivate: [AuthGuard],
    resolve: {
      person: PersonResolver,
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
