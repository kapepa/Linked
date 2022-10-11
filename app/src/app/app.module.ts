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
import {PipeModule} from "./core/pipe/pipe.module";
import {PopoverModule} from "./shared/popover/popover.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    PipeModule,
    CommonModule,
    BrowserModule,
    PopoverModule,
    DirectiveModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
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
