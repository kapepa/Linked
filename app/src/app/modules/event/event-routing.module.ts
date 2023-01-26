import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {EventComponent} from "./event.component";
import {AuthGuard} from "../../core/guard/auth.guard";
import {UserResolver} from "../../core/resolver/user.resolver";
import {EventsResolver} from "../../core/resolver/events.resolver";

export const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      events: EventsResolver,
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EventRoutingModule {}
