import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HeaderModule } from "../../shared/header/header.module";
import { TapeProfileModule } from "../../shared/tape-profile/tape-profile.module";
import { RecommendedModule } from "../../shared/recommended/recommended.module";
import { NewPublicationsModule } from "../../shared/new-publications/new-publications.module";
import { TapePostModule } from "../../shared/tape-post/tape-post.module";

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
    TapePostModule,
  ]
})
export class HomeModule { }
