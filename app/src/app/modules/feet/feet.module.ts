import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeetComponent } from "./feet.component";
import { IonicModule } from "@ionic/angular";
import { HeaderModule } from "../../shared/header/header.module";
import { CommentModule } from "../../shared/comment/comment.module";
import { BasementModule } from "../../shared/basement/basement.module";
import { FeetRoutingModule } from "./feet-routing.module";
import { PostModule } from "../../shared/post/post.module";
import { PostEditionModule } from "../../shared/post-edition/post-edition.module";

@NgModule({
  declarations: [
    FeetComponent
  ],
  imports: [
    PostModule,
    IonicModule,
    CommonModule,
    HeaderModule,
    CommentModule,
    BasementModule,
    PostEditionModule,
    FeetRoutingModule,
  ]
})
export class FeetModule { }
