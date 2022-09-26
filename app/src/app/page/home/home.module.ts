import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HeaderModule } from "../../component/header/header.module";
import { TapeProfileModule } from "../../component/tape-profile/tape-profile.module";
import { RecommendedModule } from "../../component/recommended/recommended.module";
import { NewPublicationsModule } from "../../component/new-publications/new-publications.module";

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    HeaderModule,
    HomeRoutingModule,
    CommonModule,
    IonicModule,
    FormsModule,
    TapeProfileModule,
    RecommendedModule,
    NewPublicationsModule,
  ]
})
export class HomeModule { }
