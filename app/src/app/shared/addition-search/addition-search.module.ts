import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionSearchComponent } from "./addition-search.component";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AdditionSearchComponent
  ],
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class AdditionSearchModule { }
