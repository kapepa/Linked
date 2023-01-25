import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeetComponent } from "./feet.component";
import { PostResolver } from "../../core/resolver/post.resolver";
import { UserResolver } from "../../core/resolver/user.resolver";
import { AuthGuard } from "../../core/guard/auth.guard";
import { PostsResolver } from "../../core/resolver/posts.resolver";

const routes: Routes = [
  {
    path: ':id',
    component: FeetComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      post: PostResolver,
      posts: PostsResolver,
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeetRoutingModule {}
