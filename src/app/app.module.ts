import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {CryptoMoon} from './app.component';
import {ApiService} from "../services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {CoinDetailsPageModule} from "../pages/coin-details/coin-details.module";
import {CoinListPageModule} from "../pages/coin-list/coin-list.module";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {WalletPageModule} from "../pages/wallet/wallet.module";
import {IonicStorageModule} from "@ionic/storage";
import {WalletEditPageModule} from "../pages/wallet-edit/wallet-edit.module";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {IonicImageLoader} from "ionic-image-loader";
import {WebsocketService} from "../services/websocket.service";

@NgModule({
  declarations: [
    CryptoMoon,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CryptoMoon, {
      backButtonText: '',
      swipeBackEnabled: false,
    }),
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    TabsPageModule,
    CoinListPageModule,
    CoinDetailsPageModule,
    WalletPageModule,
    WalletEditPageModule,
    SettingsPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CryptoMoon,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    WebsocketService,
    InAppBrowser,
    ScreenOrientation,
    NativePageTransitions
  ]
})
export class AppModule {
}
