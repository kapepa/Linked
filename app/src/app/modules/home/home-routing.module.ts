import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { AuthGuard } from "../../core/guard/auth.guard";
import { PostsResolver } from "../../core/resolver/posts.resolver";
import { UserResolver } from "../../core/resolver/user.resolver";
import { RecommendedResolver } from "../../core/resolver/recommended.resolver";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      posts: PostsResolver,
      recommended: RecommendedResolver,
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class HomeRoutingModule {}
