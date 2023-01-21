import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../core/guard/auth.guard";
import {UserResolver} from "../../core/resolver/user.resolver";
import {NgModule} from "@angular/core";
import {EventDetailedComponent} from "./event-detailed.component";
import {EventResolver} from "../../core/resolver/event.resolver";

export const routes: Routes = [
  {
    path: ':id',
    component: EventDetailedComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      event: EventResolver,
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EventDetailedRoutingModule {}
