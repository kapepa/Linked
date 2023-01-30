import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NewsComponent} from "./news.component";

const routes: Routes = [
  { path: ':id', component: NewsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
