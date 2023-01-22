import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../core/guard/auth.guard";
import {UserResolver} from "../../core/resolver/user.resolver";
import {NgModule} from "@angular/core";
import {EventDetailedComponent} from "./event-detailed.component";
import {EventResolver} from "../../core/resolver/event.resolver";
<<<<<<< HEAD
import {EventsResolver} from "../../core/resolver/events.resolver";
=======
>>>>>>> 2f2490c84c31548508b2502ba84af8ad11d1431e

export const routes: Routes = [
  {
    path: ':id',
    component: EventDetailedComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      event: EventResolver,
<<<<<<< HEAD
      events: EventsResolver,
=======
>>>>>>> 2f2490c84c31548508b2502ba84af8ad11d1431e
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
