import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {ExploreContainerComponentModule} from "../../explore-container/explore-container.module";
import {HeaderModule} from "../../component/header/header.module";



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
    ExploreContainerComponentModule,
  ]
})
export class HomeModule { }
