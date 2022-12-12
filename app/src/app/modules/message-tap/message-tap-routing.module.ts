import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageTapComponent } from "./message-tap.component";

const routes: Routes = [
  { path: '', component: MessageTapComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageTapRoutingModule { }
