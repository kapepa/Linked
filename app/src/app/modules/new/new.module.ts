import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewCenterRoutingModule } from "./new-routing.module";
import { NewComponent } from "./new.component";
import { IonicModule } from "@ionic/angular";
import { HeaderModule } from "../../shared/header/header.module";
import { BasementModule } from "../../shared/basement/basement.module";
import { HttpClientModule } from "@angular/common/http";
import { NgxEditorModule } from "ngx-editor";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [
    NewComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    HeaderModule,
    CommonModule,
    RouterModule,
    BasementModule,
    NgxEditorModule,
    HttpClientModule,
    ReactiveFormsModule,
    NewCenterRoutingModule,
  ]
})
export class NewModule { }
