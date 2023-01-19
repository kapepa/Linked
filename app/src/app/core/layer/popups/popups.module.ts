import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupsComponent} from "./popups.component";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    PopupsComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
  ],
  exports: [
    PopupsComponent,
  ]
})
export class PopupsModule { }
