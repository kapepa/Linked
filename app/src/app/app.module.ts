import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ActivatedRoute, RouteReuseStrategy} from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IonicStorageModule } from '@ionic/storage-angular';
import { JwtInterceptor } from "./core/interceptor/jwt.interceptor";
import { DirectiveModule } from "./core/directive/directive.module";
import { PipeModule } from "./core/pipe/pipe.module";
import { PopoverModule } from "./shared/popover/popover.module";
import { CreatePublicationModule } from "./shared/create-publication/create-publication.module";
import { PopupFriendsModule } from "./shared/popup-friends/popup-friends.module";
import { PopupNotificationModule } from "./shared/popup-notification/popup-notification.module";
import { HttpService } from "./core/service/http.service";
import { BasementModule } from "./shared/basement/basement.module";
import { CommentModule } from "./shared/comment/comment.module";
import { PopupCommentModule } from "./shared/popup-comment/popup-comment.module";
import { PostEditionModule } from "./shared/post-edition/post-edition.module";
import { FileReaderModule } from "./shared/file-reader/file-reader.module";
import { VideoReaderModule } from "./shared/video-reader/video-reader.module";
import { DocReaderModule } from "./shared/doc-reader/doc-reader.module";
import { AdditionSearchModule } from "./shared/addition-search/addition-search.module";
import { GroupSideBarModule } from "./shared/group-side-bar/group-side-bar.module";
import { PopupEventModule } from "./shared/popup-event/popup-event.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    PipeModule,
    CommonModule,
    BrowserModule,
    PopoverModule,
    CommentModule,
    BasementModule,
    DocReaderModule,
    DirectiveModule,
    AppRoutingModule,
    HttpClientModule,
    FileReaderModule,
    PopupEventModule,
    PostEditionModule,
    VideoReaderModule,
    GroupSideBarModule,
    PopupCommentModule,
    PopupFriendsModule,
    ReactiveFormsModule,
    AdditionSearchModule,
    PopupNotificationModule,
    CreatePublicationModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    HttpService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true, },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
