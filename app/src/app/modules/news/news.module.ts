import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewsRoutingModule} from "./news-routing.module";
import {NewsComponent} from "./news.component";
import {IonicModule} from "@ionic/angular";
import {HeaderModule} from "../../shared/header/header.module";
import {PopupsModule} from "../../core/layer/popups/popups.module";
import {BasementModule} from "../../shared/basement/basement.module";
import {MainNewsModule} from "../../shared/main-news/main-news.module";
import {AsideNewsModule} from "../../shared/aside-news/aside-news.module";

@NgModule({
  declarations: [
    NewsComponent,
  ],
  imports: [
    IonicModule,
    HeaderModule,
    CommonModule,
    PopupsModule,
    MainNewsModule,
    BasementModule,
    AsideNewsModule,
    NewsRoutingModule,
  ],
})
export class NewsModule { }
