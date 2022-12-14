import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ChatComponent } from "./chat.component";
import { AuthGuard } from "../../core/guard/auth.guard";
import { UserResolver } from "../../core/resolver/user.resolver";
import { TapeFriendsModule } from "../../shared/tape-friends/tape-friends.module";
import { ConversationResolver } from "../../core/resolver/conversation.resolver";

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      conversation: ConversationResolver,
    },
  },
  {
    path: 'mobile',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'friends',
        loadChildren: () => import('./../friends-tap/friends-tap.module').then(m => m.FriendsTapModule),
      },
      {
        path: 'message',
        loadChildren: () => import('./../message-tap/message-tap.module').then(m => m.MessageTapModule),
      }
    ],
    resolve: {
      user: UserResolver,
      conversation: ConversationResolver,
    },
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
