import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsTapComponent } from "./friends-tap.component";

const friendsRoutes: Routes = [
  {
    path: '',
    component: FriendsTapComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(friendsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FriendsTapRoutingModule {}
