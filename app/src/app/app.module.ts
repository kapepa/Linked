import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

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
import { PersonModule } from "./modules/person/person.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    PipeModule,
    PersonModule,
    CommonModule,
    BrowserModule,
    PopoverModule,
    DirectiveModule,
    AppRoutingModule,
    HttpClientModule,
    PopupFriendsModule,
    ReactiveFormsModule,
    CreatePublicationModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true, },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
