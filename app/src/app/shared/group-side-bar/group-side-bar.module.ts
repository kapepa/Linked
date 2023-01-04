import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupSideBarComponent } from "./group-side-bar.component";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    GroupSideBarComponent
  ],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
  ],
  exports: [
    GroupSideBarComponent
  ]
})
export class GroupSideBarModule { }
