import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {CrytoMoon} from './app.component';
import {ApiService} from "../services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {TabsPage} from "../pages/tabs/tabs";
import {CoinListPage} from "../pages/coin-list/coin-list";
import {SettingsPage} from "../pages/settings/settings";
import {AltfolioPage} from "../pages/altfolio/altfolio";

@NgModule({
  declarations: [
    CrytoMoon,
    TabsPage,
    CoinListPage,
    AltfolioPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CrytoMoon),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CrytoMoon,
    TabsPage,
    CoinListPage,
    AltfolioPage,
    SettingsPage
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
