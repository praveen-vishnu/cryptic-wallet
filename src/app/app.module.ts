import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {CrytoMoon} from './app.component';
import {ApiService} from "../services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {CoinDetailsPageModule} from "../pages/coin-details/coin-details.module";
import {CoinListPageModule} from "../pages/coin-list/coin-list.module";
import {AltfolioPageModule} from "../pages/altfolio/altfolio.module";
import {SettingsPageModule} from "../pages/settings/settings.module";

@NgModule({
  declarations: [
    CrytoMoon,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CrytoMoon),
    BrowserAnimationsModule,
    HttpClientModule,
    TabsPageModule,
    CoinListPageModule,
    CoinDetailsPageModule,
    AltfolioPageModule,
    SettingsPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CrytoMoon,
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
