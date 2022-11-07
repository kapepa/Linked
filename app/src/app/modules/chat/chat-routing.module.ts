import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ChatComponent } from "./chat.component";
import { AuthGuard } from "../../core/guard/auth.guard";
import { UserResolver } from "../../core/resolver/user.resolver";

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
    }
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
})

export class ChatRoutingModule { }
