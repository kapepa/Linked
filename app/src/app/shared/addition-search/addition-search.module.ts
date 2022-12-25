import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionSearchComponent } from "./addition-search.component";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [
    AdditionSearchComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class AdditionSearchModule { }
