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
import {CoinDetailsPage} from "../pages/coin-details/coin-details";
import {ChartsModule} from "ng2-charts";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PipesModule} from "../pipes/pipes.module";
import {ComponentsModule} from "../components/components.module";

@NgModule({
  declarations: [
    CrytoMoon,
    TabsPage,
    CoinListPage,
    CoinDetailsPage,
    AltfolioPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CrytoMoon),
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    NgxChartsModule,
    ComponentsModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CrytoMoon,
    TabsPage,
    CoinListPage,
    CoinDetailsPage,
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
