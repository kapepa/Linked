import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendedCellComponent } from "./recommended-cell.component";
import { IonicModule } from "@ionic/angular";
import { DirectiveModule } from "../../core/directive/directive.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    RecommendedCellComponent,
  ],
  exports: [
    RouterModule,
    DirectiveModule,
    RecommendedCellComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class RecommendedCellModule { }
