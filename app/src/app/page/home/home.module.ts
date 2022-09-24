import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {ExploreContainerComponentModule} from "../../explore-container/explore-container.module";



@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ExploreContainerComponentModule,
  ]
})
export class HomeModule { }
