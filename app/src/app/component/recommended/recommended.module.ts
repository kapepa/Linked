import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendedComponent } from "./recommended.component";
import { IonicModule } from "@ionic/angular";
import { RecommendedCellModule } from "../recommended-cell/recommended-cell.module";



@NgModule({
  declarations: [
    RecommendedComponent,
  ],
  exports: [
    RecommendedComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RecommendedCellModule,
  ]
})
export class RecommendedModule { }
