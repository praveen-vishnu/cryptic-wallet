import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {CrytoMoon} from './app.component';
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {CoinListPage} from "../pages/coin-list/coin-list";

@NgModule({
  declarations: [
    CrytoMoon,
    CoinListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CrytoMoon),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CrytoMoon,
    CoinListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    InAppBrowser
  ]
})
export class AppModule {
}
