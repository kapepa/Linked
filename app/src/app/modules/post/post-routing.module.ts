import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from "./post.component";
import { PostResolver } from "../../core/resolver/post.resolver";

const routes: Routes = [
  {
    path: ':id',
    component: PostComponent,
    resolve: {
      post: PostResolver,
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
