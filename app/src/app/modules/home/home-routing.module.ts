import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { AuthGuard } from "../../core/guard/auth.guard";
import { PostsResolver } from "../../core/resolver/posts.resolver";
import { UserResolver } from "../../core/resolver/user.resolver";
<<<<<<< HEAD
import { RecommendedResolver } from "../../core/resolver/recommended.resolver";
=======
>>>>>>> origin

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      posts: PostsResolver,
<<<<<<< HEAD
      recommended: RecommendedResolver,
=======
>>>>>>> origin
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class HomeRoutingModule {}
