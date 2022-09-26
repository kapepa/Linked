import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendedCellComponent } from "./recommended-cell.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    RecommendedCellComponent,
  ],
  exports: [
    RecommendedCellComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class RecommendedCellModule { }
