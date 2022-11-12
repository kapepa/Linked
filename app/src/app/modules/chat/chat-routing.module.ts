import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ChatComponent } from "./chat.component";
import { AuthGuard } from "../../core/guard/auth.guard";
import { UserResolver } from "../../core/resolver/user.resolver";
import { ChatResolver } from "../../core/resolver/chat.resolver";
import { TapeFriendsModule } from "../../shared/tape-friends/tape-friends.module";

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      chat: ChatResolver,
    }
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TapeFriendsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
})

export class ChatRoutingModule { }
