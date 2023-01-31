import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NewsComponent} from "./news.component";
import {AuthGuard} from "../../core/guard/auth.guard";
import {UserResolver} from "../../core/resolver/user.resolver";
import {NewsResolver} from "../../core/resolver/news.resolver";
import {TidingsResolver} from "../../core/resolver/tidings.resolver";

const routes: Routes = [
  {
    path: ':id',
    component: NewsComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      news: NewsResolver,
      tidings: TidingsResolver,
    }
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule { }
